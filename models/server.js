require('colors');
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'))
    }

    routes(){
        //usuarios
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`App escuchando en el puerto ${this.port}`.green.bold);
        });
    }
}

module.exports = Server;