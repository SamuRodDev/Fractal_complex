// Obtener los elementos del DOM
const canvasMandelbrot = $('#canvasMandelbrot');
const pointCanvas = $('#pointCanvas');
const complexNumber = $('#complex-number');
const canvasJul = $('#canvasJul');
const canvasContainer = $('#canvas-container');
const rectanglesContainer = $('#rectangles-container');

//Definición clase Complex
class Complex {
    constructor(real, imaginary) {
      this.real = real;
      this.imaginary = imaginary;
    }
    
    square() {  //Método para elevar al cuadrado un número complejo dado
      const real = this.real * this.real - this.imaginary * this.imaginary;
      const imaginary = 2 * this.real * this.imaginary;
      return new Complex(real, imaginary);
    }
  
    add(c) {    //Método que suma a un número complejo dado un número complejo que recibe por parámetro
      const real = this.real + c.real;
      const imaginary = this.imaginary + c.imaginary;
      return new Complex(real, imaginary);
    }
  
    magnitude() {   //Devuelve el módulo del número complejo
      return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }
  
    toString() {
        if (this.real == 0 && this.imaginary == 0) return `0`;
        if (this.real == 0 && this.imaginary != 0) return `${this.imaginary}i`;
        if (this.real != 0 && this.imaginary == 0) return `${this.real}`;
        if (this.real != 0 && this.imaginary < 0) return `${this.real} ${this.imaginary}i`;
        if (this.real != 0 && this.imaginary > 0) return `${this.real} + ${this.imaginary}i`;
    }
  
    subtract(c) {   //Método que resta a un número complejo dado un número complejo que recibe como parámetro
      const real = this.real - c.real;
      const imaginary = this.imaginary - c.imaginary;
      return new Complex(real, imaginary);
    }
    
    multiply(c) {   //Método que multiplica a un número complejo dado por un número complejo recibido como parámetro
      const real = this.real * c.real - this.imaginary * c.imaginary;
      const imaginary = this.real * c.imaginary + this.imaginary * c.real;
      return new Complex(real, imaginary);
    }
  }

// Variables para el dibujo del set de Mandelbrot y del set de Julia
const MAX_ITERATIONS = 100;
const MAX_ITERATIONS_JULIA = 100;
const DEFAULT_MIN_X_MAND = -2;
const DEFAULT_MAX_X_MAND = 1;
const DEFAULT_MIN_Y_MAND = -1.5;
const DEFAULT_MAX_Y_MAND = 1.5;
const DEFAULT_MIN_X_JULIA = -2.5;
const DEFAULT_MAX_X_JULIA = 2.5;
const DEFAULT_MIN_Y_JULIA = -2;
const DEFAULT_MAX_Y_JULIA = 2;
const DEFAULT_COMPLEX = new Complex(0, 0);
const pointRadius = 5;
let minX = DEFAULT_MIN_X_MAND;
let maxX = DEFAULT_MAX_X_MAND;
let minY = DEFAULT_MIN_Y_MAND;
let maxY = DEFAULT_MAX_Y_MAND;
let dragging = false;
let mouseX = 0;
let mouseY = 0; 
let offset = new Complex(0, 0);
let currentComplex = DEFAULT_COMPLEX;
let juliaComplex = DEFAULT_COMPLEX;

//Obtener las coordenadas del canvas de Mandelbrot
const mandelbrotRect = canvasMandelbrot[0].getBoundingClientRect();
const mandelbrotRectLeft = mandelbrotRect.left;
const mandelbrotRectTop = mandelbrotRect.top;
const mandelbrotRectRight = mandelbrotRect.left + mandelbrotRect.width;
const mandelbrotRectBottom = mandelbrotRect.top + mandelbrotRect.height;


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
        const centerAux = complexToPixel(DEFAULT_COMPLEX);
        const leftAux = 2 - centerAux.real + pointRadius;
        const rightAux = 802 - centerAux.real - pointRadius;
        const topAux = 2 - centerAux.imaginary + pointRadius;
        const bottomAux = 602 - centerAux.imaginary - pointRadius;
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
        
    }
});

// Controlador de eventos para cuando se suelta el botón del mouse
pointCanvas.on('mouseup', function() {
    dragging = false;
    cleanJuliaSet();
    drawJuliaSet();
});

//Función que actualiza el textBox 'complex-number' en función de donde esté situado el punto rojo
function updateTextBox(c) {
    $('#complex-number').val(c.toString());
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
    for (let i = 0; i < MAX_ITERATIONS; i++) {
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
    for (let i = 0; i < MAX_ITERATIONS_JULIA; i++){
        z_0 = z.square().add(c);
        if (z_0.magnitude() > 2){
            return false;
        }
    }
    return true;
}
//Función que limpia el canvas de Julia
function cleanJuliaSet(){
    for (let x = 0; x < canvasJul[0].width; x++) {
        for (let y = 0; y < canvasJul[0].height; y++) {
            ctxJulia.fillStyle = 'white';
            ctxJulia.fillRect(x, y, 1, 1);
        }
    }
}
// Función que dibuja el conjunto de Julia en su canvas
function drawJuliaSet() {
    for (let x = 0; x < canvasJul[0].width; x++) {
        for (let y = 0; y < canvasJul[0].height; y++) {
            minX = DEFAULT_MIN_X_JULIA;
            maxX = DEFAULT_MAX_X_JULIA;
            minY = DEFAULT_MIN_Y_JULIA;
            maxY = DEFAULT_MAX_Y_JULIA;
            const zJul = pixelToComplex({x, y});
            if (isInJuliaSet(juliaComplex, zJul)) {
                ctxJulia.fillStyle = 'black';
            } else {
                ctxJulia.fillStyle = 'white';
            }
            ctxJulia.fillRect(x, y, 1, 1);
        }
    }
    minX = DEFAULT_MIN_X_MAND;
    maxX = DEFAULT_MAX_X_MAND;
    minY = DEFAULT_MIN_Y_MAND;
    maxY = DEFAULT_MAX_Y_MAND;
}

// Función que dibuja el conjunto de Mandelbrot en su canvas
function drawMandelbrotSet() {
    for (let x = 0; x < canvasMandelbrot[0].width; x++) {      //Recorre el eje X del canvas
      for (let y = 0; y < canvasMandelbrot[0].height; y++) {   //Recorre el eje Y del canvas
        const c = pixelToComplex({ x, y });                 //Se convierte el píxel de coordenadas x e y en un número complejo
        if (isInMandelbrotSet(c)) {                         //Comprueba que el número complejo forma parte del set de Mandelbrot
          ctxMandelbrot.fillStyle = 'black';                    //Si es así, pintará el pixel de negro
        } else {
          ctxMandelbrot.fillStyle = 'white';                    //Si no es asi, pintará el pixel de blanco
        }
        ctxMandelbrot.fillRect(x, y, 1, 1);                 //Una vez sabemos de qué color va a ser el pixel, se pinta el pixel
      }
    }
  
    // Dibujar el punto rojo en el canvas pointCanvas
    const pixel = complexToPixel(DEFAULT_COMPLEX);
    ctxPoint.clearRect(0, 0, pointCanvas[0].width, pointCanvas[0].height);
    ctxPoint.fillStyle = 'red';
    ctxPoint.beginPath();
    ctxPoint.arc(pixel.real, pixel.imaginary, pointRadius, 0, 2 * Math.PI);
    ctxPoint.fill();

    //Mostrar en el textBox 'complex-number' el número complejo por defecto
    updateTextBox(DEFAULT_COMPLEX);
    drawJuliaSet();
}
  
// Dibujar el conjunto de Mandelbrot al cargar la página
drawMandelbrotSet();
  
