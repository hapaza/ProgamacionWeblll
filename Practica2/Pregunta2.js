function mifuncion(palabra) {
    return palabra.split('').reverse().join('');
    
}
//aplicamos el ejemplo
let cadena = mifuncion("abcd");
console.log(cadena);