/**
 * Controladores para las peticiones HTTP
 * @module Controllers
 */

const {response, request, json} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

/**
 * Funcion que inicia sesion comprobando las credenciales proporcionadas en el body.
 * Si el correo no existe, el usuario esta bloqueado o la contraseña es incorrecta
 * no permite el acceso.
 * Si las credenciales son correctas admite al usuario y genera un JWT.
 * @async
 * @param {Express.Request} req `HTTP request` emitida por el cliente. La informacion proporcionada por el cliente, 
 * debe tener el correo y la contraseña del usuario
 * @param {Express.Response} res Respuesta que emite el servidor
 * @returns {void}
 */
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
            return res.status(403).json({
                msg: 'Este usuario no puede acceder'
            });
        }

        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos'
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

/**
 * Funcion que realiza el inicio de sesion de un usuario con Google SignIn.
 * Si el usuario existe comprueba si este esta bloqueado, de ser así le niega
 * el acceso, de no estarlo lo logea.
 * Si el usuario no existe lo crea, usando la imagen, el correo y el 
 * nombre proporcionados, ademas de asignarle el rol USER_ROLpor defecto.
 * @async
 * @param {Express.Request} req `HTTP request` emitida por el cliente
 * @param {Express.Response} res `HTTP response` emitida por el servidor
 * @returns {void} 
 */
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