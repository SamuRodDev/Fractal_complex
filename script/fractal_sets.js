//Importar clase Complex
import Complex from "./fractal_sets_tools.js";
import { complexToPixel, pixelToComplex, drawJuliaSet, drawMandelbrotSet } from "./fractal_sets_tools.js";

// Obtener los elementos del DOM
const canvasMandelbrot = $('#canvasMandelbrot');
const pointCanvas = $('#pointCanvas');
const canvasJul = $('#canvasJul');

// Variables para el dibujo del set de Mandelbrot y del set de Julia
const default_complex = new Complex(0, 0);
const redPointOrigin = complexToPixel(default_complex, pointCanvas);
let juliaComplex = default_complex;
let sendX = 0;
let sendY = 0;

//Definición propiedades punto rojo
const redPoint = {
    x: redPointOrigin.real,
    y: redPointOrigin.imaginary,
    radius: 5,
    color: 'red',
    isDragging: false,
  };

// Obtener el contexto de los canvas
const ctxMandelbrot = canvasMandelbrot.get(0).getContext('2d');
const ctxPoint = pointCanvas.get(0).getContext('2d');
const ctxJulia = canvasJul.get(0).getContext('2d');

// Controlador de eventos para cuando se presiona el botón del mouse
pointCanvas.on('mousedown', function(event) {
    const rect = pointCanvas[0].getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (
        mouseX >= redPoint.x - redPoint.radius &&
        mouseX <= redPoint.x + redPoint.radius &&
        mouseY >= redPoint.y - redPoint.radius &&
        mouseY <= redPoint.y + redPoint.radius
      ) {
        redPoint.isDragging = true;
      }
});
  
// Controlador de eventos para cuando se mueve el mouse
pointCanvas.on('mousemove', function(event) {
    // Verifica si se está arrastrando el punto
    if (redPoint.isDragging) {
        const rect = pointCanvas[0].getBoundingClientRect();
        redPoint.x = event.clientX - rect.left;
        redPoint.y = event.clientY - rect.top;

        // Calcula las coordenadas complejas correspondientes al punto actual
        let x = parseInt(redPoint.x);
        let y = parseInt(redPoint.y);
        let zAux1 = pixelToComplex({x, y}, pointCanvas);
        let zAux2 = new Complex(zAux1.real.toFixed(2), zAux1.imaginary.toFixed(2));

        // Actualiza la variable juliaComplex con las coordenadas complejas correspondientes
        juliaComplex = zAux1;

        // Actualiza el cuadro de texto con las coordenadas complejas redondeadas
        updateTextBox(zAux2);

        // Actualiza las variables sendX y sendY con las coordenadas complejas actuales
        sendX = zAux1.real;
        sendY = zAux1.imaginary;
        drawRedPoint();
        drawJuliaSet(juliaComplex, canvasJul, ctxJulia);
    }
});

// Controlador de eventos para cuando se suelta el botón del mouse
pointCanvas.on('mouseup', function() {
    redPoint.isDragging = false;
});

//Función onclick para botón de mandelbrot
$("#btnMandelbrot").click(function(){
    window.location.href= "drawing_tool.html";
})

//Función onclick para botón de julia
$("#btnJulia").click(function(){
    window.location.href= "drawing_tool.html?real=" + encodeURIComponent(sendX) + "&imag=" + encodeURIComponent(sendY);
})
//Función que actualiza el textBox 'complex-number' en función de donde esté situado el punto rojo
function updateTextBox(c) {
    $('#complex_number').val(c.toString());
}

//Función que dibuja el punto rojo en el canvas pointCanvas
function drawRedPoint(){
    ctxPoint.clearRect(0, 0, pointCanvas[0].width, pointCanvas[0].height);
    ctxPoint.beginPath();
    ctxPoint.arc(redPoint.x, redPoint.y, redPoint.radius, 0, 2 * Math.PI);
    ctxPoint.fillStyle = redPoint.color;
    ctxPoint.fill();
    ctxPoint.closePath();
}

// Dibujar el conjunto de Mandelbrot al cargar la página
drawMandelbrotSet(canvasMandelbrot, ctxMandelbrot);
drawRedPoint();

//Dibujar el conjunto de Julia para 0 por defecto
updateTextBox(default_complex);
drawJuliaSet(juliaComplex, canvasJul, ctxJulia);
