function mifuncion(palabra) {
    const palabra2 = palabra.toLowerCase().replace(/\s+/g,'');
    const invertido =palabra.split('').reverse().join('');
    return palabra2 === invertido;
}
let band = mifuncion("oruro");
console.log(band);
band = mifuncion("hola");
console.log(band);