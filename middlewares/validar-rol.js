/**
 * Validadores para las requests HTTP
 * @module Validators
 */

const { response, request } = require("express");

/**
 * Comprueba si un usuario contiene el rol de ADMIN_ROL
 * @param {Express.Request} req `HTTP request` emitida por el cliente
 * @param {Express.Response} res `HTTP response` emitida por el servidor
 * @param {Express.Application} next 
 * @returns {({msg:string}|void)}
 */
const esAdminRol = (req = request, res = response, next) =>{
    if ( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar en token primero'
        });
    }
    
    const {rol, nombre} = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(403).json({
            msg: `${nombre} no es administrador, si piensa que es un error contacte a los administradores`
        });
    }

    next();
}

/**
 * Comprueba si un usuario contiene uno de los roles
 * @param  {Array<string>} roles Roles que quieren comprobarse
 * @returns {({msg:string}|void)} Mensajes dependiendo de la respuesta del servidor
 */
const tieneRol = (...roles) => {
    return (req, res, next) => {
        if(!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar en token primero'
            });
        }

        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    esAdminRol,
    tieneRol
}