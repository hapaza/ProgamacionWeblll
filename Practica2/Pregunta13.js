function producto(id) {
    return new Promise(resolve =>{
        setTimeout(() => {
            console.log(`producto: ${id}`);
            resolve({ disponible: true , stock: 9999})
        }, 1000);
    })
}
function calcular(ubicacion) {
    return new Promise(resolve =>{
        setTimeout(() => {
            console.log( `ubicacion: ${ubicacion}`);
            resolve ({ costo: 345, tiempo: 5})
        }, 1500);
    })
}
function procesar(monto) {
    return new Promise( resolve =>{
        setTimeout(() => {
            console.log(`el monto es de: ${monto}`);
            resolve({exito: true, cod: 'kmd3ld'})
        }, 1000);
    })
}
function mensaje(palabra, cod) {
    return new Promise(resolve =>{
        setTimeout(() => {
            console.log(`agradecimiento: ${palabra}`);
            resolve({ enviado: true})
        }, 1500);
    })
}

async function visual(id, ubicacion, palabra) {
    try {
        const cantidad = await producto(id);
    if( !cantidad.disponible){
        console.log("producto disponoble en 0");
        return;
    }

    const envio = await calcular(ubicacion);
    const propina = await envio.costo + 1234;
    const to = await procesar(propina);

    if(! to.exito){
        console.log("fallo el sistema");
        return;
    }

    const agradecimiento = await mensaje(palabra , to.cod);

    return{
        exito: true,
        cod: to.cod,
        propina
    }
    } catch (error) {
        console.error(" no se pudo procesar");
        throw error;
    }
}

visual('1kj2', 'ctr/fgh/1243', 'muchas gracias')