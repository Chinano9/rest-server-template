/**
 * Esquemas de bases de datos
 * @module Schemas
 */

const {Schema, model} = require('mongoose');

/**Esquema que toman los usuarios en la DB */
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatiorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatioria'],
    },
    img:{
        type: String,
    },
    rol:{
        type: String,
        required: true,
    },
    estado:{
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    }
});

/**
 * Transforma los datos del usuario en un JSON
 * @returns {object} Usuario sin su `password`, `id` ó `__v`
 */
UsuarioSchema.methods.toJSON = function (){
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario',UsuarioSchema);