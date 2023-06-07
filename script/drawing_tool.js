//Importar clase Complex
import Complex from "./fractal_sets_tools.js";

//Lógica para recibir datos de la anterior página
const labelRec = $("#set_type");
var urlParams = new URLSearchParams(window.location.search);
var realR = urlParams.get("real");
var imagR = urlParams.get("imag");
let juliaNumber = new Complex(realR, imagR);
let setType = 0;
if (realR && imagR) {
    labelRec[0].innerText = "Conjunto de Julia correspondiente al número complejo: " + juliaNumber.toString();
    setType = 1;
}

//Variables para el dibujo del conjunto correspondiente
const canvasDrawing = $("canvasDrawing");
const ctxDrawing = canvasDrawing.get(0).getContext('2d');
const default_complex = new Complex(0, 0);

