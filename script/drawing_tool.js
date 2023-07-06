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
let lineType = 0;
let middlePoint = 0;
let firstPoint, secondPoint, thirdPoint, slopeVal;

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
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if(canvasHandler == 1){
            firstPoint = {"x": x, "y": y};
            drawCircle(firstPoint);
            canvasHandler = 2;
        } else if (canvasHandler == 2){
            lineType = 0;
            secondPoint = {"x": x, "y": y};
            drawCircle(secondPoint);
            slopeVal = defineSlope(firstPoint, secondPoint);
            drawLine(firstPoint, slopeVal, lineType);
            canvasHandler = 3;
        } else if (canvasHandler == 3){
            thirdPoint = {x, y};
            drawCircle(thirdPoint);
            drawLine(thirdPoint, slopeVal, lineType);
            lineType = 1;
            middlePoint = defineMiddePoint(firstPoint, thirdPoint);
            drawLine(middlePoint, slopeVal, lineType);
            btnChannel.attr('disabled', false);
            canvasHandler = 0;
        }
    } 
})

//Función que dibuja puntos rojos sobre el canvas
function drawCircle(point){
    ctxDraw.beginPath();
    ctxDraw.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctxDraw.fillStyle = color;
    ctxDraw.fill();
}

function drawLine(point, slope, lineType){
    let values = defineLine(point, slope);
    let aExt = values[0];
    let bExt = values[1];

    //Dibujar la línea
    ctxDraw.beginPath();
    if(lineType == 1) ctxDraw.setLineDash([2, 2]);
    ctxDraw.moveTo(aExt.x, aExt.y);
    ctxDraw.lineTo(bExt.x, bExt.y);
    ctxDraw.strokeStyle = color;
    ctxDraw.stroke();
}

//Función que define una recta
function defineLine(point, slope){
    let interceptY = defineIntercept(point, slope);
    let minValue = 0;
    let maxValue = canvasDraw[0].height;
    let aExt, bExt;
    let xVal = (minValue - interceptY) / slope;
    let yVal = slope * minValue + interceptY;

    
    if(xVal >= 0 && xVal <= 800){
        aExt = {"x": xVal, "y": minValue};
        if(yVal >= 0 && yVal <= 800){
            bExt = {"x": minValue, "y": yVal};
        }else{
            yVal = slope * maxValue + interceptY;
            if(yVal >= minValue && yVal <= maxValue) bExt = {"x": maxValue, "y": yVal};
            else{
                xVal = (maxValue - interceptY) / slope; 
                bExt = {"x": xVal, "y": maxValue};  
            } 
        }
    }else {
        xVal = (maxValue - interceptY) / slope; 
        if(xVal >= minValue && xVal <= maxValue) aExt = {"x": xVal, "y": maxValue};
        else {
            yVal = slope * maxValue + interceptY;
            aExt = {"x": maxValue, "y": yVal};
            yVal = slope * minValue + interceptY;
        }
        if(yVal >= 0 && yVal <= 800){
            bExt = {"x": minValue, "y": yVal};
        }else{
            yVal = slope * maxValue + interceptY;
            if(yVal >= minValue && yVal <= maxValue) bExt = {"x": maxValue, "y": yVal};
            else{
                xVal = (maxValue - interceptY) / slope; 
                bExt = {"x": xVal, "y": maxValue};  
            }
        }
    }
    return [aExt, bExt];
}

//Función que defina la pendiente entre dos puntos
function defineSlope(a, b){
    let slope = (b.y - a.y) / (b.x - a.x);
    return slope
}

//Función que define la ordenada al origen
function defineIntercept(point, slope){
    let interceptY = point.y - slope * point.x;
    return interceptY;
}

//Función que define el punto medio entre dos puntos
function defineMiddePoint(point1, point2){
    let mpx = (point1.x + point2.x)/2;
    let mpy = (point1.y + point2.y)/2;
    let mp = {"x": mpx, "y": mpy};
    return mp;
}