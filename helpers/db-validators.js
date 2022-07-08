const Rol = require('../models/rol');
const Usuario = require('../models/usuario')

const esRolValido = async(rol = '')=> {
    const existeRol = await Rol.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esá registrado en la base de datos`);
    }
}

const correoExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya esta registrado`);
    }
}

module.exports = {
    esRolValido,
    correoExiste
}