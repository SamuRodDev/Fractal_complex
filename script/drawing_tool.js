//Importar clase Complex
import Complex from "./complex_class.js";

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
const max_iterations = 100;
const default_min_x_mand = -2;
const default_max_x_mand = 0.5;
const default_min_y_mand = -1.25;
const default_max_y_mand = 1.25;
const default_min_x_julia = -1.75;
const default_max_x_julia = 1.75;
const default_min_y_julia = -1.75;
const default_max_y_julia = 1.75;
const default_complex = new Complex(0, 0);

