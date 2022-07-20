/**
 * Herramientas variadas para modularizar la aplicacion
 * @module Helpers
 */

const JWT = require('jsonwebtoken')

/**
 * Crea un Json Web Token con el id del usuario y lo retorna en el `resolve`
 * @param {string} uid Id del usuario en la base de datos
 * @returns {Promise<string>} Token JWT valido durante 4 horas.
 */
const generarJWT = ( uid = '' ) => {
    return new Promise((resolve, reject) => {
        const payload =  {uid};
        JWT.sign(payload, process.env.SECRETORPRIVATE_KEY, {
            expiresIn: '4h'
        },
        (err, token) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el token')
            }else{
                resolve(token)
            }
        });
    });
}

module.exports = {
    generarJWT
}