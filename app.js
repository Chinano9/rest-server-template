require('dotenv').config();

const Server = require('./models/server');

/**Inicia el servidor ejecutando su constructor 
 * y lo pone a escuchar en el puerto indicado
 * @alias Init
*/
const server = new Server();

server.listen();