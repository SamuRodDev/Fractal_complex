//Importar clase Complex y funciones para dibujar los sets
import Complex, { drawJuliaSet, drawMandelbrotSet } from "./fractal_sets_tools.js";

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
            // drawLine(firstPoint, secondPoint);
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
// function drawLine(point1, point2){
    
// }