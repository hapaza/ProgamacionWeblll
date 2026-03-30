function CallBack(){
    console.log("Archivo descargado...:)");
}

function mifuncion(CallBack){
    setTimeout(CallBack, 2000);
}
mifuncion(CallBack);