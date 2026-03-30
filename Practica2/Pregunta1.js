function mifuncion(texto){
    const vocal = [ 'a','e','i','o','u'];
    // convertimos las vocales en minusculas para evitar errores
    const textochico = texto.toLowerCase();
    //aplicamos lo reduce y un contador para poder ser un doble for
    //aplicamos una funcion flecha
    return vocal.reduce((contar, vocales) => {
         contar[vocales] = [...textochico].filter( c => c === vocales).length;
        return contar;
    }, {});
}


    let obj = mifuncion("Euforia");
    console.log(obj);