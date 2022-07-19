const {response, request, json} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req,res) => {
    const {id_token} = req.body;
    try{
        const {correo, nombre, img} = await googleVerify( id_token );

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //creamos usuario
            const data = {
                rol: 'USER_ROL',
                nombre,
                correo,
                img,
                password: 'nohaycontraseñaxd',
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el suario en DB
        if(!usuario.estado){
            return res.status(403).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });
        }

        const token = await generarJWT(usuario.id);

        res.status(200).json({
            usuario,
            token
        })
        
    }catch(e){
        res.status(400).json({
            e,
            msg:'El token no se pudo verificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}