function Usuario(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Trabajos asignados del usuario:");
            resolve({id: id , nombre: "juan"});
        }, 1000);
    });
}
function Tareas(tarea) {
    return new Promise((resolve) =>{
        setTimeout(() => {
            console.log(`Las tareas del usuario: ${tarea.nombre} `);
            resolve([
                {
                    id: 123 , re: 'consultorio'
                },
                {
                    id: 123 , re: 'areglo de sistema'
                }
            ])
        }, 1000);
    });
}

function Reunion(obligacion){
    return new Promise ((resolve) => {
        setTimeout(() => {
            console.log(`Despues de la reunion: ${obligacion.re} `);
            resolve(["reunion urgente" , "reunion virtual"]);
        }, 1000);
    });
}
async function procedimiento() {
    try {
        const user = await Usuario(1);
        const tra = await Tareas(user);
        const primer = await Reunion(tra);
        console.log('Ultima actividad: ', primer);
    } catch (error) {
        console.error('Error', error);
    }
}

procedimiento();