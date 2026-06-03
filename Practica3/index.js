import express from 'express';
import mysql from 'mysql2/promise'
const app = express();


app.use(express.json());
const pool =mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mercado'
});

//Pregunta 1
app.post('/categorias' , async (req,res) =>{
    const {nombre, descripcion} = req.body;
    const [resultado] = 
    await pool.query('INSERT INTO categorias(nombre , descripcion) VALUES (?,?)',[nombre,descripcion]);

    res.send({mensaje:"datos enviados correctamente"});
});

//Pregunta2
app.get('/categorias' , async (req,res) =>{
    
    const [resultado] = 
    await pool.query('SELECT * FROM categorias');

    res.send(resultado);
});

//Pregunta 3
app.get('/categorias/:id' , async (req,res) =>{
    const  cod=req.params.id
    const [resultado] = 
    await pool.query('SELECT * FROM categorias WHERE id= ?',[cod]);

    res.send(resultado);
});

//Pregunta 4
app.patch('/categorias/:id' , async (req,res) =>{
    const cod = req.params.id;
    const {nombre, descripcion} = req.body;
    const [resultado] = 
    await pool.query(
        'UPDATE categorias SET nombre = ?, descripcion=?  WHERE id = ?',[nombre,descripcion, cod]);

    res.send({mensaje:'datos actualizados correctamente'});
});

//Pregunta 5
app.delete('/categorias/:id' , async (req,res) =>{
    const  cod=req.params.id
    const [resultado] = 
    await pool.query('DELETE  FROM categorias WHERE id= ?',[cod]);

    res.send({mensaje:'dato eliminados correctamente'});
});


const puerto = 3001;
app.listen(puerto, () => {
    console.log(`estado del funcionamiento`);
    console.log(`servidor activo desde : https://localhost:${puerto}`);
 
})
