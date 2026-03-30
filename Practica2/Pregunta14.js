function convertir(promesa) {
    return function(...etc) {
        const callback = etc.pop();

        promesa(...etc)
        .then(resultado => callback(null , resultado))
        .catch(error => callback(error, null))
    }
}
 function productos(id) {
    return new Promise((resolve ,recject ) => {
        setTimeout(() => {
            const producto = {
                1: {id:1 , nombre: 'producto1' , precio: 123},
                2: { id: 2 , nombre: 'producto2' , precio: 145}
            }
            const pro = producto[id];
            if( pro){
                resolve(producto)
            }else{
                recject(new Error(`producto ${id} no encontrado`))
            }
        }, 1000);
    })
 }
 const convertido = convertir(productos);

 convertido(2,(error,pro)=>{
    if (error) {
        console.error(`mensaje: ${error}`);
    } else {
        console.log('producto encontrado');
        console.log(pro);  
    }
 })