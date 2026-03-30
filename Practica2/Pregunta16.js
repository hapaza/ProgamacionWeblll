function usuarios(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("obteniendo usuario");
            resolve({id: 1 , nombre: 'juan'})
        }, 1000);
    })
}
function publicacioness(user) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Publicacion de ${user}`);
            resolve([{id: 1 , publicado:'primer publicado'}, {id: 2 , publicado: 'segundo publicado'}])
        }, 1000);
    })
}

function comentario(publica) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Los comentarios");
            resolve([{id: 1 , coment: 'bien'}, {id: 2 , coment: 'entretenido'}])
        }, 1000);
    })
}

async function ejecucion(id) {
    try {
        const usuario = await usuarios(id);
        const publicaciones = await publicacioness(usuario);
        const publicacion = publicaciones[2];
        const comentarios = await comentario(publicacion);

        return{
            id: id,
            publicaciones: publicaciones,
            comentario: comentarios
        }
    } catch (error) {
        console.error('error' , error);
        throw error;
    }
}
ejecucion(1).then(resultado => {
    console.log(resultado.id.nombre);
    console.log(resultado.publicaciones.length);
    console.log(resultado.comentario.length);
    
    
})