const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.json({limit: '50mb'}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin123',
    database: 'bd_juju'

});

db.connect((err) =>{
    if(err){
        console.error('Error de conexion a la base de datos', err);
    }else{
        console.error('Conexion exitosa a la base de datos');
    }
});

app.use(cors());

const crudRoutes = require('./Routes/crudRoutes.js')(db);
app.use('/crud', crudRoutes);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).send({ error: 'Error en el analisis de JSON'});
    }else{
        next();
    }
})

app.listen(port,()=>{
    console.log(`Servidor backend en funcionamiento en el puerto ${port}`);

});



