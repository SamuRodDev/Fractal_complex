//Importar clase Complex
import Complex from "./complex_class.js";

// Obtener los elementos del DOM
const canvasMandelbrot = $('#canvasMandelbrot');
const pointCanvas = $('#pointCanvas');
const canvasJul = $('#canvasJul');

// Variables para el dibujo del set de Mandelbrot y del set de Julia
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
const pointRadius = 5;
const canvasBorder = (canvasMandelbrot[0].offsetWidth - canvasMandelbrot[0].width) / 2;
let minX = default_min_x_mand;
let maxX = default_max_x_mand;
let minY = default_min_y_mand;
let maxY = default_max_y_mand;
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
    if (dragging) {
        const deltaX = event.offsetX - mouseX;
        const deltaY = event.offsetY - mouseY;
        const oldX = parseFloat(pointCanvas.attr('data-x'));
        const oldY = parseFloat(pointCanvas.attr('data-y'));
        const centerAux = complexToPixel(default_complex);
        const leftAux = 0 - centerAux.real + pointRadius;
        const rightAux = canvasMandelbrot[0].width - centerAux.real - pointRadius;
        const topAux = 0 - centerAux.imaginary + pointRadius;
        const bottomAux = canvasMandelbrot[0].height - centerAux.imaginary - pointRadius;
        let newX = oldX + deltaX;
        let newY = oldY + deltaY;

        if (newX < leftAux) newX = leftAux;
        if (newX > rightAux) newX = rightAux;
        if (newY < topAux) newY = topAux;
        if (newY > bottomAux) newY = bottomAux;

        pointCanvas.css({left: newX + 'px', top: newY + 'px'});
        pointCanvas.attr('data-x', newX);
        pointCanvas.attr('data-y', newY);
        mouseX = event.offsetX;
        mouseY = event.offsetY; 

        let x = parseInt(newX + centerAux.real);
        let y = parseInt(newY + centerAux.imaginary);
        let zAux1 = pixelToComplex({x, y});
        let zAux2 = new Complex(zAux1.real.toFixed(2), zAux1.imaginary.toFixed(2));
        juliaComplex = zAux1;
        updateTextBox(zAux2);
        sendX = zAux2.real;
        sendY = zAux2.imaginary;
        
    }
});

// Controlador de eventos para cuando se suelta el botón del mouse
pointCanvas.on('mouseup', function() {
    dragging = false;
    drawJuliaSet();
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

//Función que convierte un número compejo en un pixel del canvas
function complexToPixel(c) {
    const x = ((c.real - minX) / (maxX - minX)) * canvasMandelbrot.get(0).width;
    let y = ((c.imaginary - minY) / (maxY - minY)) * canvasMandelbrot.get(0).height;
    y = canvasMandelbrot.get(0).height - y;
    return new Complex(x, y);
}


// Función que convierte un pixel del canvas en un número complejo
function pixelToComplex(p) {
    const real = map(p.x, 0, canvasMandelbrot[0].width, minX, maxX);
    const imaginary = map(p.y, canvasMandelbrot[0].height, 0, minY, maxY);
    return new Complex(real, imaginary);
}


// Función que mapea un número de un rango a otro
function map(value, min1, max1, min2, max2) {
    return (value - min1) * (max2 - min2) / (max1 - min1) + min2;
}

// Función que determina si un número pertenece al conjunto de Mandelbrot
function isInMandelbrotSet(c) {
    let z = new Complex(0, 0);
    for (let i = 0; i < max_iterations; i++) {
        z = z.square().add(c);
        if (z.magnitude() > 2) {
            return false;
        }
    }
    return true;
}

// Función que determina si un número pertenece al conjunto de Julia
function isInJuliaSet(c, z) {
    let z_0 = new Complex(0, 0);
    for (let i = 0; i < max_iterations; i++){
        if (i==0) z_0 = z.square().add(c);
        else z_0 = z_0.square().add(c);
        if (z_0.magnitude() > 2){
            return false;
        }
    }
    return true;
}

// Función que dibuja el conjunto de Julia en su canvas
function drawJuliaSet() {
    let zJul = new Complex (0,0);
    for (let x = 0; x < canvasJul[0].width; x++) {
        for (let y = 0; y < canvasJul[0].height; y++) {
            minX = default_min_x_julia;
            maxX = default_max_x_julia;
            minY = default_min_y_julia;
            maxY = default_max_y_julia;
            zJul = pixelToComplex({x, y});
            if (isInJuliaSet(juliaComplex, zJul)) {
                ctxJulia.fillStyle = 'black';
            } else {
                ctxJulia.fillStyle = 'white';
            }
            ctxJulia.fillRect(x, y, 1, 1);
        }
    }
    minX = default_min_x_mand;
    maxX = default_max_x_mand;
    minY = default_min_y_mand;
    maxY = default_max_y_mand;
}

// Función que dibuja el conjunto de Mandelbrot en su canvas
function drawMandelbrotSet() {
    let c = new Complex (0,0);
    for (let x = 0; x < canvasMandelbrot[0].width; x++) {      //Recorre el eje X del canvas
      for (let y = 0; y < canvasMandelbrot[0].height; y++) {   //Recorre el eje Y del canvas
        c = pixelToComplex({ x, y });                 //Se convierte el píxel de coordenadas x e y en un número complejo
        if (isInMandelbrotSet(c)) {                         //Comprueba que el número complejo forma parte del set de Mandelbrot
          ctxMandelbrot.fillStyle = 'black';                    //Si es así, pintará el pixel de negro
        } else {
          ctxMandelbrot.fillStyle = 'white';                    //Si no es asi, pintará el pixel de blanco
        }
        ctxMandelbrot.fillRect(x, y, 1, 1);                 //Una vez sabemos de qué color va a ser el pixel, se pinta el pixel
      }
    }
  
    // Dibujar el punto rojo en el canvas pointCanvas
    const pixel = complexToPixel(default_complex);
    pixel.real = pixel.real + canvasBorder;
    pixel.imaginary = pixel.imaginary + canvasBorder;
    ctxPoint.clearRect(0, 0, pointCanvas[0].width, pointCanvas[0].height);
    ctxPoint.fillStyle = 'red';
    ctxPoint.beginPath();
    ctxPoint.arc(pixel.real, pixel.imaginary, pointRadius, 0, 2 * Math.PI);
    ctxPoint.fill();

    //Mostrar en el textBox 'complex-number' el número complejo por defecto
    updateTextBox(default_complex);
    drawJuliaSet();
}
  
// Dibujar el conjunto de Mandelbrot al cargar la página
drawMandelbrotSet();
  
