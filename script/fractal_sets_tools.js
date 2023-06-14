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

//Definición variables
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
let minX = default_min_x_mand;
let maxX = default_max_x_mand;
let minY = default_min_y_mand;
let maxY = default_max_y_mand;

//Función que convierte un número compejo en un pixel del canvas
export function complexToPixel(c, canvas) {
    const x = ((c.real - minX) / (maxX - minX)) * canvas.get(0).width;
    let y = ((c.imaginary - minY) / (maxY - minY)) * canvas.get(0).height;
    y = canvas.get(0).height - y;
    return new Complex(x, y);
}

// Función que convierte un pixel del canvas en un número complejo
export function pixelToComplex(p, canvas) {
    const real = map(p.x, 0, canvas[0].width, minX, maxX);
    const imaginary = map(p.y, canvas[0].height, 0, minY, maxY);
    return new Complex(real, imaginary);
}

// Función que mapea un número de un rango a otro
function map(value, min1, max1, min2, max2) {
    return (value - min1) * (max2 - min2) / (max1 - min1) + min2;
}

// Función que determina si un número pertenece al conjunto de Mandelbrot
export function isInMandelbrotSet(c) {
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
export function isInJuliaSet(c, z) {
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
export function drawJuliaSet(juliaComplex, canvas ,context) {
    const imageData = context.createImageData(canvas[0].width, canvas[0].height);
    const data = imageData.data;
    let zJul = new Complex (0,0);
    let index = 0;

    for (let x = 0; x < canvas[0].width; x++){
        for (let y = 0; y < canvas[0].height; y++){
            index = (y * canvas[0].width + x) * 4;
            zJul = pixelToComplex({x,y}, canvas);
            const isInSet = isInJuliaSet(juliaComplex, zJul);
            minX = default_min_x_julia;
            maxX = default_max_x_julia;
            minY = default_min_y_julia;
            maxY = default_max_y_julia;
            
            data[index] = isInSet ? 0 : 255;
            data[index + 1] = isInSet ? 0 : 255;
            data[index + 2] = isInSet ? 0 : 255;
            data[index + 3] = 255;
        }
    }
    minX = default_min_x_mand;
    maxX = default_max_x_mand;
    minY = default_min_y_mand;
    maxY = default_max_y_mand;
    context.putImageData(imageData, 0, 0);
}

// Función que dibuja el conjunto de Mandelbrot en su canvas
export function drawMandelbrotSet(canvas, context) {
    const imageData = context.createImageData(canvas[0].width, canvas[0].height);
    const data = imageData.data;
    let c = new Complex (0,0);
    let index = 0;

    for (let x = 0; x < canvas[0].width; x++){
        for (let y = 0; y < canvas[0].height; y++){
            index = (y * canvas[0].width + x) * 4;
            c = pixelToComplex({x, y}, canvas);
            const isInSet = isInMandelbrotSet(c);

            data[index] = isInSet ? 0 : 255;
            data[index + 1] = isInSet ? 0 : 255;
            data[index + 2] = isInSet ? 0 : 255;
            data[index + 3] = 255;
        }
    }

    context.putImageData(imageData, 0, 0);
}

export default Complex;