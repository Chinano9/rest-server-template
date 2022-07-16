const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/generar-jwt');

const login = async(req = request, res = response) => {
    const {correo, password} = req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos'
            });
        }
        //verificar si el usuario esta activo

        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - inactivo'
            });
        }

        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - contraseña'
            });
        }

        //generar JWT
        const token = await generarJWT(usuario.id);


        res.status(200).json({
            msg:'Login completado',
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Hable con el administrador del servidor"
        })
    }
}

module.exports = {
    login
}