function Inicio(id) {
    return new Promise((resolve) =>{
        setTimeout(() => {
            console.log("DESCARGA TUS ARCHIVOS AQUI")
            resolve({
                id: 1,  nombre: 'Google2.0'  
            })
        }, 1000);
    })
}

function Progreso(destino) {
    return new Promise((resolve) =>{
        setTimeout(() => {
            console.log(`Tu porcentaje de avance es: ${destino.nombre}`)
            resolve([
                {
                    id: 123 , titulo: "85%"
                },
                {
                    id: 345 , titulo: "99.9 %"
                }
            ])
        }, 1000);
    })
}

function terminado(mensaje){
    return new Promise ((resolve) => {
        setTimeout(() => {
            console.log(`su Procedo ha sido: ${mensaje.titulo}`);
        resolve([
            {
                id: 123 , texto: "Descarga exitosa "
            },
            {
                id: 234 , texto: "Internet demasiado lento"
            }
        ])
        }, 1000);
    })
}

Inicio(1)
.then(Progreso)
.then(mensaje => terminado(mensaje[0]))
.then(detalle => console.log('estado de descarga: ' , detalle))
.catch(console.error);