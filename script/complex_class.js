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

export default Complex;