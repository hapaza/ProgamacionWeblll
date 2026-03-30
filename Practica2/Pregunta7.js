const arreglo = [11, 22, 33, 44, 55, 66, 77];
const [primer, segundo, ...resto] = arreglo;
console.log("primer y segundo elemnto: ", primer, segundo);
console.log("Resto",resto);