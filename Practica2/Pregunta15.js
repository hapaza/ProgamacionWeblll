function archivo(nombre , callback) {
    setTimeout(() => {
        const arch = {
            'd1txt': 'contenido del archivo en formato legible',
            'configuracion': '{version: 9.9 , nombre: "juan" }'
            
        }
        const contenido = arch[nombre];
    if (contenido) {
        callback(null , contenido)
    } else {
        callback(new Error(`archivo ${nombre} no encontrado`), null)
    }
    }, 1500);
    
}
 function leer(nombreArchivo){
    return new Promise((resolve, recject) => {
        archivo(nombreArchivo, (error , resultado)=>{
            if (error) {
                recject(error);
            } else {
                resolve(resultado);
            }
        })
    })
 }

 leer('d1txt')
 .then(contenido => {
    console.log("contenido del archivo");
    console.log(contenido);
 })
 .catch(error =>{
    console.error("error ocurrido");
    
 })