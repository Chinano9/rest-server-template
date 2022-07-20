/**
 * Configuraciones y utilidades para las bases de datos
 * @module Database
 */

const mongoose = require('mongoose');
require('colors')

/**
 * Inicializa la coneccion a la base de datos MongoDB
 * @async
 * @throws Errores al conectarse a la base de datos
 */
const dbConection = async () => {
    try {
        await mongoose.connect( process.env.MONGODB_CNN, {
            
        } );

        console.log('Base de datos activa'.green.bold);
    } catch (error) {
        console.log(error)
        throw new Error("Error al inicializar DB")
    }
}

module.exports = {
    dbConection,
}