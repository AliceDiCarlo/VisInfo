
var delayTime = 10;
/*
var delayTime = 1000,
    updateTime = 500;
*/


 /*  Display Settings */

//margini
var margin = {top: 30, right: 62, bottom: 20, left: 80};



// screen 1024×768
//define the margins

var width = 1280 - margin.left - margin.right;
var height = 768 - margin.top - margin.bottom;



var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)     
    .attr("height", height + margin.top + margin.bottom)  
    .style("background","blue")    
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

