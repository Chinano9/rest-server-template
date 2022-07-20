/**
 * Validadores para las requests HTTP
 * @module Validators
 */

const { validationResult } = require('express-validator');

/**
 * Valida que todos los campos previamente comprobados por otros `handlers` sean validos y no contengan errores
 * @param {Express.Request} req HTTP request emitida por el cliente
 * @param {Express.Response} res HTTP response emitida por el servidor
 * @param {Express.Application} next 
 * @returns {({...errores:Error}|void)} JSON en el que se muestran los errores lanzados por los `handlers`
 */
const validarCampos =  ( req, res, next ) =>{
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json(errores);
    }

    next();
}

module.exports = {
    validarCampos
}