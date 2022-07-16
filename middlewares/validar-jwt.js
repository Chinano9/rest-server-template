const { request } = require('express');
const JWT = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res, next) => {
    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg:'Usuario no autenticado'
        });
    }

    try {
        
        const {uid} = JWT.verify( token, process.env.SECRETORPRIVATE_KEY);

        //leer usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'token no valido - usuario no existente'
            })
        }

        //verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(403).json({
                msg: 'token no valido - usuario inactivo'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) { 
        res.status(401).json({
            msg:'Token no valido'
        })
    }
}

module.exports = {validarJWT};