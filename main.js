var win = window.innerHeight;
console.log(win)
//Access the css variables
var r = document.querySelector(':root');
var t = document.querySelector('#colorprint')

//Final three colors
var mainHue ="rgb(255,0,0)";
var mainFull = "rgb(255,0,0)";
var invFull = "";

//Convert length of selector bar to division of color spectrum
var gridbits = 15;
var pix = 100;
var boxes = 4*pix;
var htm = boxes/5;

//Default percent values for Saturation and Value
var sPer = 1;
var vPer = 0;




//Converts vh to pixels for selectorbar
function vhToPix(){
    win = window.innerHeight;
    pix = Math.round((gridbits*win)/100);
    boxes = 4*pix;
    htm = boxes/5;
    rgbToHex()
}

//Converts rgb to bar length equivalent
function barToRgb(inGo){
    let rgb = 256;
    let conver = htm/rgb;
    let output = Math.round(inGo/conver);
    return output;
}

//Sets css variable for main background color
function setChosen(inGo) {
    r.style.setProperty('--chosen', inGo);
    document.getElementById('colorprint').innerHTML = inGo;
  }

//Sets css variable for saturation max and value min gradient colors
function setSat(inGo){
    r.style.setProperty('--satup', inGo)
    r.style.setProperty('--valdown', inGo)

}

//Sets css variable for inverted color background
function setInvChosen(inGo) {
    r.style.setProperty('--invChosen', inGo);
    document.getElementById('invColor').innerHTML = inGo;
  }

//Turns the inGo string value into a list of rgb values
function doneStrip(inGo){
    let takeFront = inGo.replace("rgb(", "")
    let takeEnd = takeFront.replace(")","")
    let makeList = takeEnd.split(",")
    return makeList;
}

function rgbToHex(){
    let r1;
    let r2;
    let g1;
    let g2;
    let b1;
    let b2;

    let rgbarr = doneStrip(mainFull)
    if ((rgbarr[0]/16) > 0){
        let R = (rgbarr[0]/16).toString();
        let rarr = R.split(".")
        console.log(rarr)
        r1 = rarr[0];
        if (Math.floor(rarr[1]/16)){
            r2 = Math.floor(rarr[1]/16)
        } else {
            r2 = 0;
        }
    } else {
        r1 = 0;
        r2 = 0;
    }

    let G = (rgbarr[1]/16).toString();
    let garr = G.split(".")
     g1 = garr[0];
     g2 = Math.floor(garr[1]/16);
    let B = (rgbarr[0]/16).toString();
    let barr = B.split(".")
     b1 = barr[2];
     b2 = Math.floor(barr[1]/16);
    let hexOut = "#"+r1+r2+g1+g2+b1+b2;
    console.log(hexOut)
}


//Inverts the main color
function invertColor(){
    let arrey = doneStrip(mainFull)
    let red = arrey[0]
    let gre = arrey[1]
    let blu = arrey[2]
    let invred = Math.abs(red-255)
    let invgre = Math.abs(gre-255)
    let invblu = Math.abs(blu-255)
    invFull = "rgb("+invred+","+invgre+","+invblu+")";
    return invFull

}

//Flips the text color of the main readout
function flipText(){
    let arrey = doneStrip(mainFull)
    let red = arrey[0]
    let gre = arrey[1]
    let blu = arrey[2]
    if (red < 180 && gre < 180 && blu < 180){
        document.getElementById("colorprint").style.color = "#ffffff";
    } else {
        document.getElementById("colorprint").style.color = "#000000";
    }
}

//Flips the text color of the inverted color readout
function invFlipText(){
    let arrey = doneStrip(invFull)
    let red = arrey[0]
    let gre = arrey[1]
    let blu = arrey[2]
    if (red < 180 && gre < 180 && blu < 180){
        document.getElementById("invColor").style.color = "#ffffff";
    } else {
        document.getElementById("invColor").style.color = "#000000";
    }
}

//Contains common functions each event needs to call
function common(){
    mainFull = valCalc(satCalc())
    setChosen(valCalc(satCalc()))
    setInvChosen(invertColor())
    invFlipText()
    flipText()
    win = window.innerHeight;
}

//Event called on mousemove over hue bar
function hueEvent(event){
    var shit = document.getElementById("hueEvent")
    var rect = shit.getBoundingClientRect();
    let xMos = event.clientX
    let xPos = Math.round(xMos - rect.left);
    hueCalc(xPos)
    setSat(mainHue)
    common()
}

//Event called on mousemove over saturation bar
function satEvent(event){
    var shit = document.getElementById("satEvent")
    var rect = shit.getBoundingClientRect();
    let yMos = event.clientY;
    let yPos = (Math.round(Math.abs((yMos - rect.top)-boxes)))-1;
    sPer = (yPos/boxes)
    common()    
}

//Event called on mousemove over value bar
function valEvent(event){
    var shit = document.getElementById("valEvent")
    var rect = shit.getBoundingClientRect();
    let yMos = event.clientY;
    let yPos = (Math.round(Math.abs((yMos - rect.top)-boxes)))-1
    vPer = (yPos/boxes);
    common()
}

//Calculate color Hue
function hueCalc(inGo){
    let nig = barToRgb(inGo)
    let rgb = 256
    if (nig > rgb*4){
        mainHue = "rgb("+(nig-rgb*4)+",0,255)"
    } else if (nig > rgb*3){
        mainHue = "rgb(0,"+(255-(nig-rgb*3))+",255)"
    } else if (nig > rgb*2){
        mainHue = "rgb(0,255,"+(nig-rgb*2)+")"
    } else if (nig > rgb){
        mainHue = "rgb("+(255-(nig-rgb))+",255,0)"
    } else if (nig > 0){
        mainHue = "rgb(255,"+(nig-1)+",0)"
    }
}

//Calculate color Saturation
function satCalc(){
    let red = Math.round(parseInt(doneStrip(mainHue)[0])*sPer);
    let gre = Math.round(parseInt(doneStrip(mainHue)[1])*sPer);
    let blu = Math.round(parseInt(doneStrip(mainHue)[2])*sPer);
    return [red,gre,blu];
}

//Calculate color Value
function valCalc(inGo){
    let red = Math.round((Math.abs(inGo[0]-255)*vPer)+inGo[0]);
    let gre = Math.round((Math.abs(inGo[1]-255)*vPer)+inGo[1]);
    let blu = Math.round((Math.abs(inGo[2]-255)*vPer)+inGo[2]);
    let outrgb = "rgb("+red+","+gre+","+blu+")"
    return outrgb
}