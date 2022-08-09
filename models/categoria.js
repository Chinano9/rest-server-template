/**
 * Esquemas de bases de datos
 * @module Schemas
 */

const {Schema, model} = require('mongoose');

/**El esquema que toman las categorias en la DB*/
const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: true
    },
    creador:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = model('Categoria', CategoriaSchema);