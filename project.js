
 /*  Display Settings */

 var margin = {top: 30, right: 62, bottom: 20, left: 80};


 // screen 1024×768 - define the margins
 var width = 1280 - margin.left - margin.right;
 var height = 768 - margin.top - margin.bottom;
 
 // SVG
 var svg = d3.select("body").append("svg")
	 .attr("width", width + margin.left + margin.right)     
	 .attr("height", height + margin.top + margin.bottom)  
	 .style("background","blue")    
	 .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
 
 
 // Fish colors
 var colors =["#FF11FF","#FF7F53","#00FFFB","#006466","#A9A9A9","#008080","#FFFF00","#808000","#CD853F","#4682B4"];
 // selected fish
 var Classclicked=null;
 var clickedForms;
 var paints = [];
 var  idSelected;

 // Coordinates of fish
 var nearsX = [];
 var nearsY = [];
 
 
 // Larger values for each field
 var maxPerField = {body: 0, eye: 0, mouth: 0, fins: 0};
 
 //Main
 d3.json("data/data.json")
	 .then(function(data) {
 
		 //I load the json and for each field I find the maximum value
		 maxPerField.body=maxValue(data,"corpo");
		 maxPerField.eye=maxValue(data,"occhio");
		 maxPerField.mouth=maxValue(data,"bocca");
		 maxPerField.fins=maxValue(data,"coda");
		 
		 //For each given case I draw a fish
		 var counter=0;
		 setInterval(
			 function(){
				 if (data[counter]){
					 drawFish(data[counter],counter,colors[counter],maxPerField,null,null);
					 counter++;
				 }
			 }, 0) 
	 })
	 .catch(function(error) {
		 console.log(error);
	 });
 
 
 /*******************************  METHODS ****************************** */
 
 
 /**
  * method that return the max value in a dataset from the key
  * @param {object} values 
  * @param {string} key 
  * @returns int
  */
  function maxValue(values,key){
	 var tmp = [];
	 values.forEach( function (d) {
		 tmp.push(d[key]);
	 });
	 return Math.max.apply(null,tmp);
 }
 
 /**
  * Method that returns true when the center of an object is far enough away from other objects already on the screen
  * @param {int} centerObX 
  * @param {int} centerObY 
  * @param {Array} nearsX 
  * @param {Array} nearsY 
  * @returns {boolean} 
  */
  function freePlace(centerObX,centerObY,nearsX,nearsY){
	 var i=0
 
	 //for each obj in the Array (screen)
	 while(i<=nearsX.length){
		 //Calculate the distance between two points
		 if( Math.pow(nearsX[i]-centerObX,2)+(Math.pow(nearsY[i]-centerObY,2) )  < Math.pow(220, 2) ){
			 return true;
		 }
		 i++;
	 }
 
	 return false;
 }
 
 /**
  * Method that takes random coordinates within the available display
  * @returns {array} x, y
  */
 function getObCenter(){
	 var x = d3.randomUniform(margin.left+ 80,width-margin.right- 40)();
	 var y = d3.randomUniform(margin.bottom+60,height-margin.top-60)();
	 return [x,y];
 }
 
 /**
  * Method that draws a fish
  * @param {object} dataset 
  * @param {int} index
  * @param {string} color 
  * @param {array} dom 
  * @param {int} centerX 
  * @param {int} centerY 
  */
 
 function drawFish(dataset,index,color,dom,centerX,centerY){
	 
	 // se ho le coordinate del pesce pari a null le creo e le aggiungo
	 // alle altre posizioni in nearsX e nearsY
	 if(centerX==null && centerY==null){
		 var centerX = d3.randomUniform(margin.left+80,width-margin.right-40)();
		 var centerY = d3.randomUniform(margin.bottom+60,height-margin.top-60)();
 
		 //I do not pass the thousand attempts to find a solution to the arrangement of fish
		 var it=0;
		 while(it<1000){
			 it++;
			 var bool=freePlace(centerX,centerY,nearsX,nearsY);
			 if(!bool){	
				 break;
			 }
			 else { 
				 var origin = getObCenter();
				 centerX = origin[0];
				 centerY = origin[1];
			 }
		 }
 
		 nearsX.push(centerX);
		 nearsY.push(centerY);
	 } 
 
 
	 /********************* Management of the range of values ********************/
 
	 var domValues=Object.values(dom);
	 var max = Math.max.apply(null,domValues);
 
 
	 var bodyScaler = d3.scaleLinear().range([50,100]).domain([0,dom["body"]]);
	 var bodyLength =  bodyScaler(dataset["corpo"]);
 
 
	 var mouthScaler = d3.scaleLinear().range([17,45]).domain([0,dom["mouth"]]);
	 var mouth = mouthScaler(dataset["bocca"]);
 
	 var finScaler = d3.scaleLinear().range([0,80]).domain([0,dom["fins"]]);
	 var tailWidth = finScaler(dataset["coda"]);
	 var tailHeight = tailWidth/2;
 
	 var eyeScaler = d3.scaleLinear().range([10,40]).domain([0,dom["eye"]]);   
	 var eye = eyeScaler(dataset["occhio"]);
 
	 //
	 var j = 10;
	 var b = j; // body size
	 var tw = j;// tailWidth
	 var th = j;// tailHeight
	 var ey = j;// eye
	 var m = 5;// mouth
 
	 var clas = "fish_"+index; // fish class
 
	 //Positioning
	 var padTail = j; 
	 var padBody = j;
	 var padFin = j; 
	 var padMouth = 1; 
 
	 //Adds the animation
	 setInterval(function(){
		 //Once the correct value is reached, stop the animation
		 if(j<max){
			 svg.selectAll("."+clas).remove();
 
 
			 if(b>=bodyLength || j==max){
			 b=bodyLength;
			 } else {
				 b = j;
			 }
			 
			 if(tw>=tailWidth || j==max){
				 tw=tailWidth;
			 } else {
				 tw = j;
			 }
 
			 if(th>=tailHeight || j==max){
				 th = tailHeight;
			 } else {
				 th = j;
			 }
 
			 if(ey>=eye || j==max){
				 ey = eye;
			 } else {
				 ey = j;
			 }
 
			 if(m>=mouth || j==max){
				 m = mouth;
			 } else {
				 m = j;
			 }
 
			 if(padTail>=40 || j==max){
				 padTail = 40;
			 } else {
				 padTail = j;
			 }
			 
			 if(padBody>=30 || j==max){
				 padBody = 30;
			 } else {
				 padBody = j;
			 }
 
			 if(padFin>=80 || j==max){
				 padFin = 80;
			 } else {
				 padFin = j;
			 }
 
			 if(padMouth>=8){
				 padMouth = 8;
			 } else {
				 padMouth++;	
			 }
 
			 //bigfish fin
			 svg
			 .append("polygon")
			 .attr("class", "fish_"+index)
			 .attr("id",index)
			 .attr("onclick","modifyFishes(event)")
			 .attr("points",""+(centerX-b/2-b*0.5)+","+(centerY)+" "+(centerX-th-tw-padTail-b*0.5)+","+(centerY-th)+" "+(centerX-th-tw-padTail-b*0.5)+","+(centerY+th)+"")
			 .attr("fill","purple")
			 .attr("stroke","black")
			
 
 
			 //fish body
			 svg
			 .append("ellipse")
			 .attr("class", "fish_"+index)
			 .attr("id",index)
			 .attr("onclick","modifyFishes(event)")
			 .attr("cx",centerX)
			 .attr("cy",centerY)
			 .attr("rx",b)
			 .attr("ry",b-padBody) 
			 .attr("fill",color)
			 
 
 
			 //small fish fin	
			 var fins_offsetX= -40;
			 svg
			 .append("polygon")
			 .attr("class", "fish_"+index)
			 .attr("id",index)
			 .attr("onclick","modifyFishes(event)")
			 .attr("points",""+(centerX-padFin+tw/2)+","+(centerY)+" "+(centerX+tw/2)+","+(centerY)+" "+(centerX+10+tw/2)+","+( centerY+30))
			 .attr("fill","purple")
			 .attr("stroke","black")
			 .attr("transform", function(d){
				 var scale_factor = tw/dom.fins;
				 return  "translate(" + ( centerX+tw/2+ fins_offsetX)+ "," + ( centerY)+ ")"
				 + "scale(" + scale_factor + ")"
				 + "translate(" + (-centerX-tw/2) + "," + (-centerY ) + ")";
					 });
 
 
			 //fish eye   
			 svg
			 .append("circle")
			 .attr("class", "fish_"+index)
			 .attr("id",index)
			 .attr("onclick","modifyFishes(event)")
			 .attr("cx",(centerX+b/6)+6)
			 .attr("cy", centerY-b/6)
			 .attr("r",ey/3)
			 .attr("fill","black")
			 .attr("stroke","green");
 
 
			 //fish mouth
			 svg
			 .append("ellipse")
			 .attr("class", "fish_"+index)
			 .attr("id",index)
			 .attr("onclick","modifyFishes(event)")
			 .attr("cx",centerX+b/2)
			 .attr("cy", centerY+b/5)
			 .attr("rx", m/2)
			 .attr("ry", m/2-padMouth)
			 .attr("fill","brown")
			 .attr("stroke","brown");
 
			 j++;
		 }
	 },10);
 
 }
 
 /**
  * Method that manages the click event. Turns the selected fish white and takes the values of the second selected fish
  * @param {event} e 
  */
 function modifyFishes(e){
	 //Turns the selected fish white
	 var selector = e.target;
	 if(!Classclicked){
		 clickedForms = [];
		 idSelected = selector.getAttribute("id");	   
		 Classclicked = selector.getAttribute("class");
		 clickedForms = document.getElementsByClassName(Classclicked);
		 var i;
		 paints = [];
		 for(i=0; i<clickedForms.length; i++){
			paints.push(clickedForms[i].getAttribute("fill"));
			clickedForms[i].setAttribute("fill","white");
		 }
 
	 } else {
		//It takes the values of the second selected fish and assigns it to the previously selected one
		var classToTransform = selector.getAttribute("class");
		var toTransformForms = document.getElementsByClassName(classToTransform);
		var centerX=toTransformForms[1].getAttribute("cx");
		var centerY=toTransformForms[1].getAttribute("cy");
		var intCenterX=parseInt(centerX,10);
		var intCenterY=parseInt(centerY,10);
 
		var idToTransform = selector.getAttribute("id");
		var intIdToTransform = parseInt(idToTransform);
		
		var	intIdClicked=parseInt(idSelected,10);
 
		d3.json("data/data.json")
		 .then(function(data) {
			 svg.selectAll("."+classToTransform).remove();
			 drawFish(data[intIdClicked],intIdToTransform,colors[intIdClicked],maxPerField,intCenterX,intCenterY);
			 });
		 Classclicked=null;
		var tmp;
	
		for(i=0; i<clickedForms.length; i++ ){
			 tmp=paints[i];
			 clickedForms[i].setAttribute("fill",tmp);
		}
	 }
 
 }
 