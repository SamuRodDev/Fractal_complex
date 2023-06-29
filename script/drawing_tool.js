//Importar clase Complex
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
const canvasDrawing = $("#canvasSets");
const ctxDrawing = canvasDrawing.get(0).getContext('2d');
const default_complex = new Complex(0, 0);

//Dibujamos set de Mandelbrot o set de Julia en función de setType
if (setType == 0) drawMandelbrotSet(canvasDrawing, ctxDrawing);
else drawJuliaSet(juliaNumber, canvasDrawing, ctxDrawing);

//Función onclick para botón de mandelbrot
$("#btnBack").click(function(){
    window.location.href= "fractal_sets.html";
})