require('colors');
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

/**
 * Crea el servidor de la aplicacion
 */
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConection();
    }

    /**
     * Inicializa los middlewares del servidor
     */
    middlewares() {
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'))
    }

    /**
     * Crea las rutas de la aplicacion
     */
    routes() {
        //usuarios
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        //autenticacion
        this.app.use(this.paths.auth, require('../routes/auth'));
        //categorias
        this.app.use(this.paths.categorias, require('../routes/categorias'))
    }

    /**
     * Inicializa el servidor, y lo pone a escuhchar en el puerto especificado en la clase
     */
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App escuchando en el puerto ${this.port}`.green.bold);
        });
    }
}

module.exports = Server;