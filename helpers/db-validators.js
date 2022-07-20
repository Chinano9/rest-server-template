/**
 * Herramientas variadas para modularizar la aplicacion
 * @module Helpers
 */

const Rol = require('../models/rol');
const Usuario = require('../models/usuario')

/**
 * Comprueba si el rol asignado es valido.
 * @async
 * @param {string} rol Rol del usuario tal como esta escrito en la DB
 */
const esRolValido = async(rol = '')=> {
    const existeRol = await Rol.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esá registrado en la base de datos`);
    }
}

/**
 * Comprueba si un correo ya existe en la DB.
 * @async 
 * @param {string} correo Correo que se desea comprobar
 * @throws Error al comprobar que el correo existe en la DB
 */
const correoExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado`);
    }
}

/**
 * Comprueba si un ID de usuario ya existe en la DB.
 * Si el ID es valido se continua normalmente 
 * @param {string} id ID del usuario que se desea comprobar 
 * @throws Error al comprobar que el id no existe
 */
const existeUsuarioPorID = async(id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id ${id} no existe`);
    }
}

module.exports = {
    esRolValido,
    correoExiste,
    existeUsuarioPorID
}