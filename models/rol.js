/**
 * Esquemas de bases de datos
 * @module Schemas
 */

const {Schema, model} = require('mongoose');

/**El esquema que toman los roles en la DB */
const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});

module.exports = model('Role', RoleSchema);