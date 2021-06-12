
var delayTime = 10;
/*
var delayTime = 1000,
    updateTime = 500;
*/


 /*  Display Settings */

var margin = {top: 30, right: 62, bottom: 20, left: 80};


// screen 1024×768 - define the margins
var width = 1280 - margin.left - margin.right;
var height = 768 - margin.top - margin.bottom;



//creo un array di colori
var colors =["#FF00FF","#FF7F50","#00FFFF","#006400","#A9A9A9","#008080","#FFFF00","#808000","#CD853F","#4682B4"];
 
// creo l'elemento svg
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)     
    .attr("height", height + margin.top + margin.bottom)  
    .style("background","blue")    
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 



// restituisce il massimo di ogni proprietà del dataset
function scaler(dataset,key){
	var tmp = [];
	dataset.forEach( function (d) {
		tmp.push(d[key]);
	});
	return Math.max.apply(null,tmp);
}


// controllo se i pesci sono vicini tra loro sfruttando la distanza euclidea 
// tra i centri di due pesci la volta distanzio i pesci di 250 minimo
function isNear(centerX,centerY,nearsX,nearsY){
	var i=0
	while(i<=nearsX.length){
		if( Math.sqrt( Math.pow(nearsX[i]-centerX,2)+(Math.pow(nearsY[i]-centerY,2)) )  < 220 ){
			return true;
		}
		i++;
	}

	return false;
}
// creo due array in cui andrò a mettere le posizioni di tutti i pesci
var nearsX = [];
var nearsY = [];

// estraggo la posizione del pesce in modo randomico visto che non rappresenta alcuna informazione
function center(){
	var centerX = d3.randomUniform(margin.left+120,width-margin.right)();
	var centerY = d3.randomUniform(margin.bottom+60,height-margin.top-60)();
	return [centerX,centerY];
}

  // dataset è il singolo elemento dell'array di oggetti del file json
function drawFish(dataset,i,color,dom,centerX,centerY){
	
	// se ho le coordinate del pesce pari a null le creo e le aggiungo
	// alle altre posizioni in nearsX e nearsY
	if(centerX==null && centerY==null){
		var centerX = d3.randomUniform(margin.left+120,width-margin.right)();
		var centerY = d3.randomUniform(margin.bottom+60,height-margin.top-60)();

		// faccio un certo numero di tentativi (1000) per distanziare i pesci
		var it=0;
		while(it<1000){
			it++;
			var bool=isNear(centerX,centerY,nearsX,nearsY);
			if(!bool){	
				break;
			}
			else { 
				var origin = center();
				centerX = origin[0];
				centerY = origin[1];
			}
		}

		nearsX.push(centerX);
		nearsY.push(centerY);
	} 

	// prendo il valore massimo del singolo pesce cosi da poter fare un'animazione fluida
	// ponendo come upper bound il valore di max
	var domValues=Object.values(dom);
	var max = Math.max.apply(null,domValues);

	//mappo il dominio in input in un range in output stabilito in base alle dimensioni dell'svg
	var bodyScaler = d3.scaleLinear().range([40,130]).domain([0,dom["corpo"]]);
	var bodyLength =  bodyScaler(dataset["corpo"]);
	console.log("Dom corpo"+dom["corpo"]);
	console.log("Dom "+dom["corpo"]);
	console.log(bodyLength);


	var mouthScaler = d3.scaleLinear().range([15,50]);
	mouthScaler.domain([0,dom["bocca"]]);
	var mouth = mouthScaler(dataset["bocca"]);
	console.log("Dom bocca"+dom["bocca"]);
	console.log(bodyLength);




	var finScaler = d3.scaleLinear().range([20,100]);
	finScaler.domain([0,dom["coda"]]);
	var tailWidth = finScaler(dataset["coda"]);
	var tailHeight = tailWidth/2;



	var eyeScaler = d3.scaleLinear().range([10,44]);

					   
	eyeScaler.domain([0,dom["occhio"]]);   
	var eye = eyeScaler(dataset["occhio"]);

	//
	var j = 10;
	var b = j; // dimensione del corpo (b=body) che va a crescere progressivamente per creare l'animazione 
	var tw = j;// dimensione della coda (tw=tailWidth) che va a crescere progressivamente per creare l'animazione
	var th = j;// altezza della coda (th=tailHeight) che va a crescere progressivamente per creare l'animazione
	var ey = j;// dimensione dell'occhio (ey=eye) che va a crescere progressivamente per creare l'animazione
	var m = 5;// dimensione della bocca (m=mouth) che va a crescere progressivamente per creare l'animazione

	var clas = "fish_"+i; // prendo la classe del pesce
	var padTail = j; // serve per posizionare la coda
	var padBody = j;// serve per definire la dimensione del corpo
	var padFin = j; // serve per posizionare la pinna laterale
	var padMouth = 1; // serve per posizionare la bocca

	

	//usando la funzione seInterval creo l'animazione
	setInterval(function(){
		//quando raggiungo il massimo tra i valori di corpo pinne occhio e bocca conclucod l'animazione
		if(j<max){
            //	rimuovo il pesce creato in precedenza 
            svg.selectAll("."+clas).remove();

	
		//	se una delle dimensioni raggiunge il suo valore finale, le si assegna quel valore
		//	oppure se si raggiunge la dimensione massima
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

			//coda (vista come pinna)
			svg
			.append("polygon")
			.attr("class", "fish_"+i)
			.attr("id",i)
			.attr("onclick","modifyFishes(event)")
			.attr("points",""+(centerX-b/2-b*0.5)+","+(centerY)+" "+(centerX-th-tw-padTail-b*0.5)+","+(centerY-th)+" "+(centerX-th-tw-padTail-b*0.5)+","+(centerY+th)+"")
			.attr("fill","red")
            .attr("stroke","red")
           


			//corpo 
			svg
			.append("ellipse")
			.attr("class", "fish_"+i)
			.attr("id",i)
			.attr("onclick","modifyFishes(event)")
			.attr("cx",centerX)
			.attr("cy",centerY)
			.attr("rx",b)
			.attr("ry",b-padBody) 
            .attr("fill",color)
            


			//pinna laterale	
			var fins_offsetX= -40;
			svg
			.append("polygon")
			.attr("class", "fish_"+i)
			.attr("id",i)
			.attr("onclick","modifyFishes(event)")
			.attr("points",""+(centerX-padFin+tw/2)+","+(centerY)+" "+(centerX+tw/2)+","+(centerY)+" "+(centerX+10+tw/2)+","+( centerY+30))
			.attr("fill","red")
			.attr("stroke","red")
			.attr("transform", function(d){
				var scale_factor = tw/dom.fins;
				return  "translate(" + ( centerX+tw/2+ fins_offsetX)+ "," + ( centerY)+ ")"
				+ "scale(" + scale_factor + ")"
				+ "translate(" + (-centerX-tw/2) + "," + (-centerY ) + ")";
					});


			//occhio    
			svg
			.append("circle")
			.attr("class", "fish_"+i)
			.attr("id",i)
			.attr("onclick","modifyFishes(event)")
			.attr("cx",centerX+b/6+40)
			.attr("cy", centerY-b/6)
			.attr("r",ey/3)
			.attr("fill","black")
			.attr("stroke","red");


			//bocca
			svg
			.append("ellipse")
			.attr("class", "fish_"+i)
			.attr("id",i)
			.attr("onclick","modifyFishes(event)")
			.attr("cx",centerX+b/2)
			.attr("cy", centerY+b/5)
			.attr("rx", m/2)
			.attr("ry", m/2-padMouth)
			.attr("fill","black")
			.attr("stroke","black");

			j++;
		}
	},delayTime);

}

// creo un dizionario con le proprietà del pesce
var toDomain = {corpo: 0, occhio: 0, bocca: 0, coda: 0};
d3.json("data/data.json")
	.then(function(data) {

	// metto le chiavi del dizionario in un array e per ogni proprietà prendo il massimo
	// chiamando la funzione scaler sopra definita
	var keys = Object.keys(toDomain);
		toDomain.body=scaler(data,keys[0]);
		toDomain.eye=scaler(data,keys[1]);
		toDomain.mouth=scaler(data,keys[2]);
		toDomain.fins=scaler(data,keys[3]);

	// richiamo la funzione drawfish per tutti i datapoint del file json
	var counter=0;
	setInterval(function(){
				if (data[counter]){
					drawFish(data[counter],counter,colors[counter],toDomain,null,null);
					counter++;
				}
			}, 0) 
	})
	.catch(function(error) {
	console.log(error); // stampo l'errore
});



var Classclicked=null;
var clickedForms;
var paints = [];
var  idSelected;

// sul click chiamo la funzione modifyFishes
function modifyFishes(e){
	// sfruttando l'evento (il click) seleziono classe e id del primo pesce in modo da poterlo manipolare
	// come richiesto dalle specifiche e farlo diventare prima bianco (if) e poi dei colori precedentemente assegnati (else)
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
	   // se ho gia selezionato un pesce allora devo cambiare le proprietà del secondo pesce con quelle del primo
	   var classToTransform = selector.getAttribute("class");
	   var toTransformForms = document.getElementsByClassName(classToTransform);
	   var centerX=toTransformForms[1].getAttribute("cx");
	   var centerY=toTransformForms[1].getAttribute("cy");
		// sono costretto a fare un cast ad int per un problema di floating point
		// l'occhio umano non nota alcuna differenza anche grazie all'animazione nel disegnare il pesce
	   var intCenterX=parseInt(centerX,10);
	   var intCenterY=parseInt(centerY,10);

	   var idToTransform = selector.getAttribute("id");
	   var intIdToTransform = parseInt(idToTransform);
	   
	   var	intIdClicked=parseInt(idSelected,10);

	   d3.json("data/data.json")
		.then(function(data) {
			// rimuovo il pesce appena cliccato e lo ridisegno con le nuove proprietà
			svg.selectAll("."+classToTransform).remove();
			drawFish(data[intIdClicked],intIdToTransform,colors[intIdClicked],toDomain,intCenterX,intCenterY);
			});
		Classclicked=null; // resetto la variabile
	   var tmp;
	   // restituisco al primo pesce cliccato le sue proprietà
	   for(i=0; i<clickedForms.length; i++ ){
			tmp=paints[i];
			clickedForms[i].setAttribute("fill",tmp);
	   }
	}

}
