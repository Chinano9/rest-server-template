const { OAuth2Client } = require('google-auth-library');

/**
 * Herramientas variadas para modularizar la aplicacion
 * @module Helpers
 */

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Funcion que lleva a cabo la verificacion de Google SignIn
 * @async
 * @param {string}token Token proporcionado por Google SignIn
 * @return {Promise<{nombre:string,img:string,correo:string}>} Objeto con algunos datos del usuario que entra con Google SignIn
 */
async function googleVerify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const {name, picture, email} = ticket.getPayload();
    return {
        nombre: name,
        img: picture,
        correo: email
    }
}

module.exports={
    googleVerify
}