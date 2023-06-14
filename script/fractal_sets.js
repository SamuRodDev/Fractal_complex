//Importar clase Complex
import Complex from "./fractal_sets_tools.js";
import { complexToPixel, pixelToComplex, drawJuliaSet, drawMandelbrotSet } from "./fractal_sets_tools.js";

// Obtener los elementos del DOM
const canvasMandelbrot = $('#canvasMandelbrot');
const pointCanvas = $('#pointCanvas');
const canvasJul = $('#canvasJul');

// Variables para el dibujo del set de Mandelbrot y del set de Julia
const default_complex = new Complex(0, 0);
const pointRadius = 5;
const canvasBorder = (canvasMandelbrot[0].offsetWidth - canvasMandelbrot[0].width) / 2;
let dragging = false;
let mouseX = 0;
let mouseY = 0; 
let juliaComplex = default_complex;
let sendX = 0;
let sendY = 0;

// Obtener el contexto de los canvas
const ctxMandelbrot = canvasMandelbrot.get(0).getContext('2d');
const ctxPoint = pointCanvas.get(0).getContext('2d');
const ctxJulia = canvasJul.get(0).getContext('2d');

// Controlador de eventos para cuando se presiona el botón del mouse
pointCanvas.on('mousedown', function(event) {
    dragging = true;
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  });
  
// Controlador de eventos para cuando se mueve el mouse
pointCanvas.on('mousemove', function(event) {
    // Verifica si se está arrastrando el punto
    if (dragging) {
        // Calcula el desplazamiento en el eje X y en el eje Y
        const deltaX = event.offsetX - mouseX;
        const deltaY = event.offsetY - mouseY;

        // Obtiene la posición actual del punto en el canvas
        const oldX = parseFloat(pointCanvas.attr('data-x'));
        const oldY = parseFloat(pointCanvas.attr('data-y'));

        // Calcula los límites del canvas para evitar que el punto salga de la zona visible
        const centerAux = complexToPixel(default_complex, canvasMandelbrot);
        const leftAux = 0 - centerAux.real + pointRadius;
        const rightAux = canvasMandelbrot[0].width - centerAux.real - pointRadius;
        const topAux = 0 - centerAux.imaginary + pointRadius;
        const bottomAux = canvasMandelbrot[0].height - centerAux.imaginary - pointRadius;

        // Calcula las nuevas coordenadas del punto
        let newX = oldX + deltaX;
        let newY = oldY + deltaY;

        // Verifica si las nuevas coordenadas exceden los límites del canvas y las ajusta en caso necesario
        if (newX < leftAux) newX = leftAux;
        if (newX > rightAux) newX = rightAux;
        if (newY < topAux) newY = topAux;
        if (newY > bottomAux) newY = bottomAux;

        // Actualiza la posición del punto en el canvas
        pointCanvas.css({left: newX + 'px', top: newY + 'px'});
        pointCanvas.attr('data-x', newX);
        pointCanvas.attr('data-y', newY);

        // Actualiza las coordenadas del mouse
        mouseX = event.offsetX;
        mouseY = event.offsetY;

        // Calcula las coordenadas complejas correspondientes al punto actual
        let x = parseInt(newX + centerAux.real);
        let y = parseInt(newY + centerAux.imaginary);
        let zAux1 = pixelToComplex({x, y}, pointCanvas);
        let zAux2 = new Complex(zAux1.real.toFixed(2), zAux1.imaginary.toFixed(2));

        // Actualiza la variable juliaComplex con las coordenadas complejas correspondientes
        juliaComplex = zAux1;

        // Actualiza el cuadro de texto con las coordenadas complejas redondeadas
        updateTextBox(zAux2);

        // Actualiza las variables sendX y sendY con las coordenadas complejas actuales
        sendX = zAux1.real;
        sendY = zAux1.imaginary;
    }
});

// Controlador de eventos para cuando se suelta el botón del mouse
pointCanvas.on('mouseup', function() {
    dragging = false;
    drawJuliaSet(juliaComplex, canvasJul, ctxJulia);
    
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
    const pixel = complexToPixel(default_complex, pointCanvas);
    pixel.real = pixel.real + canvasBorder;
    pixel.imaginary = pixel.imaginary + canvasBorder;
    ctxPoint.clearRect(0, 0, pointCanvas[0].width, pointCanvas[0].height);
    ctxPoint.fillStyle = 'red';
    ctxPoint.beginPath();
    ctxPoint.arc(pixel.real, pixel.imaginary, pointRadius, 0, 2 * Math.PI);
    ctxPoint.fill();
}

// Dibujar el conjunto de Mandelbrot al cargar la página
drawMandelbrotSet(canvasMandelbrot, ctxMandelbrot);
drawRedPoint();

//Dibujar el conjunto de Julia para 0 por defecto
updateTextBox(default_complex);
drawJuliaSet(juliaComplex, canvasJul, ctxJulia);
