function Promesa() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Prosedimiento cesado exitosamente");
        }, 3000);
    })
}

Promesa().then(console.log);