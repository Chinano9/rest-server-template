const mongoose = require('mongoose');
require('colors')

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