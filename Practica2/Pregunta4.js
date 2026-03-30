function mifuncion(array) {
    return{
        mayor: Math.max(...array),
        menor: Math.min(...array)
    }
}

let obj = mifuncion([3, 1, 5, 4, 2]);
console.log(obj);