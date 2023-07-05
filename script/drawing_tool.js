//Importar clase Complex y funciones para dibujar los sets
import Complex, { complexToPixel, drawJuliaSet, drawMandelbrotSet, pixelToComplex } from "./fractal_sets_tools.js";

//Lógica para recibir datos de la anterior página
const labelRec = $("#setType");
var urlParams = new URLSearchParams(window.location.search);
var realR = parseFloat(urlParams.get("real"));
var imagR = parseFloat(urlParams.get("imag"));
let juliaNumber = new Complex(realR, imagR);
let juliaAux = new Complex(juliaNumber.real.toFixed(2), juliaNumber.imaginary.toFixed(2)); 
let setType = 0;
if ((realR && imagR) || (realR == 0 && imagR ==0)) {
    labelRec[0].innerHTML = "Conjunto de Julia correspondiente al número complejo: <b>" + juliaAux.toString() + "</b>";
    setType = 1;
}

//Variables para el dibujo del conjunto correspondiente
const canvasSets = $("#canvasSets");
const ctxSets = canvasSets.get(0).getContext('2d');

//Variables para el trazo de canales
const canvasDraw = $("#canvasDraw");
const ctxDraw = canvasDraw.get(0).getContext('2d');
const btnChannel = $("#btnChannel");
const color = 'red';
const radius = 3;
let canvasHandler = 0;
let firstPoint, secondPoint, thirdPoint;

//Dibujamos set de Mandelbrot o set de Julia en función de setType
if (setType == 0) drawMandelbrotSet(canvasSets, ctxSets);
else drawJuliaSet(juliaNumber, canvasSets, ctxSets);

//Función onclick para botón de regresar
$("#btnBack").click(function(){
    window.location.href= "fractal_sets.html";
})

//Función onclick para botón canal paralelo
btnChannel.click(function(){
    btnChannel.attr('disabled', true);
    canvasHandler = 1;
    ctxDraw.clearRect(0, 0, canvasDraw[0].width, canvasDraw[0].height);
})

//Función clicks en canvas para canal paralelo
canvasDraw.on('click', function(event){
    if (canvasHandler > 0 && canvasHandler < 4){
        const rect = canvasDraw[0].getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if(canvasHandler == 1){
            firstPoint = {mouseX, mouseY};
            drawCircle(firstPoint);
            canvasHandler = 2;
        } else if (canvasHandler == 2){
            secondPoint = {mouseX, mouseY};
            drawCircle(secondPoint);
            drawLine(firstPoint, secondPoint);
            canvasHandler = 3;
        } else if (canvasHandler == 3){
            thirdPoint = {mouseX, mouseY};
            drawCircle(thirdPoint);
            btnChannel.attr('disabled', false);
            canvasHandler = 0;
        }
    } 
})

//Función que dibuja puntos rojos sobre el canvas
function drawCircle(point){
    ctxDraw.beginPath();
    ctxDraw.arc(point.mouseX, point.mouseY, radius, 0, 2 * Math.PI);
    ctxDraw.fillStyle = color;
    ctxDraw.fill();
}

//Función que dibuja una línea sobre el canvas
function drawLine(point1, point2){
    let a = {"x": point1.mouseX, "y": point1.mouseY};
    let b = {"x": point2.mouseX, "y": point2.mouseY};
    let minValue = 0;
    let maxValue = canvasDraw[0].height;
    let slopeVal;
    let aExt = {"x": minValue, "y": minValue};
    let bExt = {"x": maxValue, "y": maxValue};
    a = changePlane(a);
    b = changePlane(b);
    if(a.x == b.x){     //Línea vertical
        aExt.x = a.x;
        bExt.x = a.x;  
    }
    if(a.y == b.y){     //Línea horizontal
        aExt.y = a.y; 
        bExt.y = a.y;
    } 
    slopeVal = defineSlope(a, b);
    if((a.x > b.x && a.y > b.y) || (a.x < b.x && a.y < b.y)){ //Pendiente negativa
        if(a.x < b.x){
            aExt.y = defineFirstY(aExt.x, a, slopeVal);
            if(aExt.y < minValue || aExt.y > maxValue) {
                aExt.y = minValue;
                aExt.x = defineFirstX(aExt.y, a, slopeVal);
            }
            bExt.y = defineSecondY(b, bExt.x, slopeVal);
            if(bExt.y < minValue || bExt.y > maxValue){
                bExt.y = maxValue;
                bExt.x = defineSecondX(b, bExt.y, slopeVal);
            }
        }else{
            aExt.y = defineFirstY(aExt.x, b, slopeVal);
            if(aExt.y < minValue || aExt.y > maxValue) {
                aExt.y = minValue;
                aExt.x = defineFirstX(aExt.y, b, slopeVal);
            }
            bExt.y = defineSecondY(a, bExt.x, slopeVal);
            if(bExt.y < minValue || bExt.y > maxValue){
                bExt.y = maxValue;
                bExt.x = defineSecondX(a, bExt.y, slopeVal);
            }
        }
    }else{  //Pendiente positiva
        aExt.x = maxValue;
        bExt.x = minValue;
        if(a.x < b.x){
            aExt.y = defineFirstY(aExt.x, a, slopeVal);
            if(aExt.y < minValue || aExt.y > maxValue) {
                aExt.y = minValue;
                aExt.x = defineFirstX(aExt.y, a, slopeVal);
            }
            bExt.y = defineSecondY(b, bExt.x, slopeVal);
            if(bExt.y < minValue || bExt.y > maxValue){
                bExt.y = maxValue;
                bExt.x = defineSecondX(b, bExt.y, slopeVal);
            }
        }else{
            aExt.y = defineFirstY(aExt.x, b, slopeVal);
            if(aExt.y < minValue || aExt.y > maxValue) {
                aExt.y = minValue;
                aExt.x = defineFirstX(aExt.y, b, slopeVal);
            }
            bExt.y = defineSecondY(a, bExt.x, slopeVal);
            if(bExt.y < minValue || bExt.y > maxValue){
                bExt.y = maxValue;
                bExt.x = defineSecondX(a, bExt.y, slopeVal);
            }
        }
    }
    //Cambiamos los valores para adaptarse al canvas
    aExt = changePlane(aExt);
    bExt = changePlane(bExt);

    //Dibujar la línea
    ctxDraw.beginPath();
    ctxDraw.moveTo(aExt.x, aExt.y);
    ctxDraw.lineTo(bExt.x, bExt.y);
    ctxDraw.strokeStyle = color;
    ctxDraw.stroke();
}

//Función que transforma un punto del origen del canvas al origen del plano o viceversa
function changePlane({x, y}){
    return {"x":y, "y": x};
}

//Función que defina la pendiente entre dos puntos
function defineSlope(a, b){
    let slope = (b.y - a.y) / (b.x - a.x);
    return slope
}

//Función que halla x1
function defineFirstX(ay, b, slope){
    let ax = -(((b.y - ay) / slope) - b.x);
    return ax;
}

//Función que halla y1
function defineFirstY(ax, b, slope){
    let ay = -(slope * (b.x - ax) - b.y);
    return ay;
}

//Función que halla x2
function defineSecondX(a, by, slope){
    let bx = (by - a.y) / slope + a.x;
    return bx;
}

//Función que halla y2
function defineSecondY(a, bx, slope){
    let by = slope * (bx - a.x) + a.y;
    return by;
}