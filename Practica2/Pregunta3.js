function mifuncion(arreglo) {
    return{
        pares: arreglo.filter(num => num % 2 == 0 ),
        impares: arreglo.filter( num => num % 2 !== 0 )
    }
}
let obj = mifuncion([1,2,3,4,5]);
console.log(obj);