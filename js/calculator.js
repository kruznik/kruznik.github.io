let rate,fishBw,protCont,livProtConc,modBw,modTemp,fractLivWt,livBfCO,fracWBL,fracBWC,logKow,totAqConc,dOC,pOC,pOCBind,dOCBind;
document.getElementById("calc").addEventListener("click",set);
document.getElementById("reset").addEventListener("click",formReset);

function formReset(){
	document.getElementById("myForm").reset();
  document.getElementById("table").style.display="none";
}

function set(){
	let totInp=[
  rate=parseFloat(document.getElementById("rate").value),
  fishBw=parseFloat(document.getElementById("fishBw").value),
  protConc=parseFloat(document.getElementById("protConc").value),
  livProtCont=parseFloat(document.getElementById("livProtCont").value),
  modBw=parseFloat(document.getElementById("modBw").value),
  modTemp=parseFloat(document.getElementById("modTemp").value),
  fractLivWt=parseFloat(document.getElementById("fractLivWt").value),
  livBfCO=parseFloat(document.getElementById("livBfCO").value),
  fracWBL=parseFloat(document.getElementById("fracWBL").value),
  fracBWC=parseFloat(document.getElementById("fracBWC").value),
  logKow=parseFloat(document.getElementById("logKow").value),
  totAqConc=parseFloat(document.getElementById("totAqConc").value),
  dOC=parseFloat(document.getElementById("dOC").value),
  pOC=parseFloat(document.getElementById("pOC").value),
  pOCBind=parseFloat(document.getElementById("pOCBind").value),
  dOCBind=parseFloat(document.getElementById("dOCBind").value),
  ];
  
  document.getElementById("output").innerHTML="";
  
  if (totInp.filter(inputTest).length==totInp.length) {
  document.getElementById("table").style.display="block";
  document.getElementById("kOW").innerHTML= round2(kOW()) +" Unitless";
  document.getElementById("bWPartCoef").innerHTML=round2(bWPartCoef()) +" Unitless";
  document.getElementById("bindCor").innerHTML=round2(bindCor())+" Unitless";
  document.getElementById("partBCF").innerHTML=round2(partBCF())+" L/kg";
  document.getElementById("volDisBp").innerHTML=round2(volDisBP())+" L/kg";
  document.getElementById("invtIntCle").innerHTML=round2(invtIntCle())+" mL/h/mg S9 protein";
  document.getElementById("invIntCle").innerHTML=round2(invIntCle())+" L/d/kg fish";
  document.getElementById("scCle").innerHTML=round2(scCle())+" L/d/kg fish";
  document.getElementById("tempCO").innerHTML=round2(tempCO())+" L/d/kg fish";
  document.getElementById("livBloFlo").innerHTML=round2(livBloFlo())+" L/d/kg fish";
  document.getElementById("hepCle").innerHTML=round2(hepCle())+" L/d/kg fish";
  document.getElementById("WBMetRat").innerHTML=round2(WBMetRat())+"/d";
  document.getElementById("chemConcinWat").innerHTML=round2(chemConcinWat())+" mg/L";
  document.getElementById("gillUpRateCon").innerHTML=round2(gillUpRateCon())+" L/kg/d";
  document.getElementById("gillElRateCon").innerHTML=round2(gillElRateCon())+" /d";
  document.getElementById("fecEgRatCon").innerHTML=round2(fecEgRatCon())+" /d";
  document.getElementById("concFish").innerHTML=round2(concFish())+" mg/kg";
  document.getElementById("BCFtotConc").innerHTML=round2(BCFtotConc())+ " L/kg";
  document.getElementById("BCFfree").innerHTML=round2(BCFfree())+ " L/kg lipid";
  document.getElementById("BCFfreeWW").innerHTML=round2(BCFfreeWW())+ " L/kg lipid";
  document.getElementById("BCFtotConcLIP").innerHTML=round2(BCFtotConcLIP())+ " L/kg lipid";
  } else {
  	document.getElementById("output").innerHTML="Error, missing inputs:";
  	let inpts = document.getElementsByClassName("input");
    let missingInpt=""
  	for (let i=0;i<inpts.length;i++){
    	if (!inputTest(parseFloat(inpts[i].value))){
  		missingInpt=missingInpt+inpts[i].parentNode.parentNode.innerText.slice(0,-2)+", ";
   		}
    }
    document.getElementById("output").innerHTML=document.getElementById("output").innerHTML+missingInpt.slice(0,-2);
  }
  
}


function inputTest(num){
	let regexp=/^[0-9]+([,.][0-9]+)?$/g;
	return (regexp.test(num))
}

function round2(numToRound){
	return (Math.round((numToRound + 0.00001) * 1000) / 1000)
}

function kOW (){
	return (Math.pow(10,logKow));
}

function bWPartCoef (){
	return (fracBWC+.16*Math.pow(10,(.73*logKow)))
}

function bindCor (){
	return ((fracBWC/bWPartCoef())/(1/(protConc*Math.pow(10,(0.694*logKow-2.158))+1)))
}

function partBCF(){
	return (fracWBL*kOW())
}

function volDisBP(){
	return (partBCF()/bWPartCoef())
}

function invtIntCle(){
	return(rate/protConc)
}

function invIntCle(){
	return(invtIntCle()*livProtCont*fractLivWt*24)
}

function scCle(){
	return(invIntCle()*(Math.pow((modBw/fishBw),0)))
}

function tempCO(){
	return((((0.23*modTemp)-0.78)*Math.pow((modBw/500),-0.1))*24)
}

function livBloFlo(){
	return(tempCO()*livBfCO)
}

function hepCle(){
	return(livBloFlo()*bindCor()*scCle()/(livBloFlo()+(bindCor()*scCle())))
}

function WBMetRat(){
	return(hepCle()/volDisBP())
}

function chemConcinWat(){
	return(totAqConc*(1/(1+dOC*dOCBind*kOW()+pOC*pOCBind*kOW())))
}

function gillUpRateCon(){
	return(1/((0.01+1/kOW())*Math.pow((modBw/1000),0.4)))
}

function gillElRateCon(){
	return(gillUpRateCon()/(fracWBL*kOW()))
}

function fecEgRatCon(){
	return(0.125*(0.02*Math.pow((modBw/1000),-0.15)*Math.exp(0.06*modTemp))/(0.000000051*kOW()+2))
}

function concFish(){
	return((gillUpRateCon()*chemConcinWat())/(gillElRateCon()+WBMetRat()+0+fecEgRatCon()))
}

function BCFtotConc(){
	return(concFish()/totAqConc)
}

function BCFfree(){
	return(concFish()/(chemConcinWat()*fracWBL))
}

function BCFfreeWW(){
	return(concFish()/(chemConcinWat()))
}

function BCFtotConcLIP(){
	return(concFish()/(totAqConc*fracWBL))
}
