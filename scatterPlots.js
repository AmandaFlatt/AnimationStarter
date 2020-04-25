var dur =1000

//get the mean of a array of grades
var getMeanGrade = function(entries)
{
    return d3.mean(entries,function(entry)
        {
            return entry.grade;
        })
}

//function draws the scatter graph takes the data and a target id
var drawScatter = function(students,target,xProp,yProp)
{   
    
     //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    var scales = recalculateScales(xProp,yProp,students,graph);
    var xScale = scales.xScale;
    var yScale = scales.yScale;
    updateAxes(target,xScale,yScale)
    setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
    //JOIN - Rebind the data 
    var circles =d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .data(students)
    
    //ENTER -add new stuff
    circles.enter()
        .append("circle")
         .on("mouseover", function(student)
                    {
                        //remove the old data.
                      
                       
                       

                        
                        console.log("test",student.picture)
                        var xPosition = d3.event.pageX;
                        var yPosition = d3.event.pageY;
                        d3.select("#tooltip")
                            .style("left",xPosition + "px")
                            .style("top",yPosition +"px")
                            .append("img")
                            .attr("id","data")
                            .attr("src", "imgs/" + student.picture)
                            
                        d3.select("#tooltip").classed("hidden",false);
                    })
        .on("mouseout",function(){
                    d3.selectAll("#tooltip #data")
                            .remove();
                    d3.select("#tooltip").classed("hidden",true);}
                )
    
    //EXIT - remove old stuff 
    circles.exit()
        .remove()
    //UPDATE -REDECORATE
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .transition()
        .duration(dur)
        .attr("cx",function(student)
    {
        return xScale(getMeanGrade(student[xProp]));    
    })
        .attr("cy",function(student)
    {
        return yScale(getMeanGrade(student[yProp]));    
    })
        .attr("r",4)
       
}



// creates the axis 
var initAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
   
    
    var axes = d3.select(target)
        .append("g")
        .classed("class","axis")
    axes.append("g")
        .attr("id","xAxis")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        
    axes.append("g")
        .attr("id","yAxis")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        
}
var updateAxes = function(target,xScale,yScale)
{
    
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    d3.select("#xAxis")
        .transition()
        .duration(dur)
        .call(xAxis)
    
    d3.select("#yAxis")
        .transition()
        .duration(dur)
        .call(yAxis)
    
    
    
}

//function to bring everything together and uses all the functions draws graph with all the axis and everything 
var initGraph = function(target,students)
{
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
  

    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
     var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([graph.height,0])
    
   
    
    
    initAxes(screen,margins,graph,
                           target,xScale,yScale)
    
    initButtons(students,target,xScale,yScale);
    
    setBanner("Click buttons to graphs");
   
    
    

}
//creates and turns on the buttons and when one button is hit it clears and redraws the graph 

var recalculateScales=function(xProp,yProp,students,graph)
{
     var xScale = d3.scaleLinear()
        .domain([0,d3.max(students.map(function(student){return getMeanGrade(student[xProp])}))])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,d3.max(students.map(function(student){return getMeanGrade(student[yProp])}))])
        .range([graph.height,0])
    
    return {xScale:xScale,yScale:yScale}
  
    
    
}







var initButtons = function(students,target,xScale,yScale)
{
    
    d3.select("#fvh")
    .on("click",function()
    {
    
       
        drawScatter(students,target,
              "final","homework");
    })
    
    d3.select("#hvq")
    .on("click",function()
    {
        
        drawScatter(students,target,
           "homework","test");
    })
    
    d3.select("#tvf")
    .on("click",function()
    {
       
        drawScatter(students,target,
            "test","final");
    })
    
    d3.select("#tvq")
    .on("click",function()
    {
        
        drawScatter(students,target,
             "test","quizes");
    })
    
    
    
}
//sets the banner/ the title
var setBanner = function(msg)
{
    d3.select("#banner")
        .text(msg);
    
}



var penguinPromise = d3.json("/classData.json");

penguinPromise.then(function(penguins)
{
    console.log("class data",penguins);
   initGraph("#scatter",penguins);
   
},
function(err)
{
   console.log("Error Loading data:",err);
});
