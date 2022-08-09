/**
 * Controladores para las peticiones HTTP
 * @module Controllers
 */

const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

/**
 * Define la accion del metodo GET en la ruta `/user` del API.
 * Responde a la request con un json, que muestra el total de ususarios que hay
 * en la DB y los usuarios definidos desde el `query`.
 * @async
 * @param {Express.Request} req `HTTP request` emitida por el cliente. Debe contener los parametros limite y desde, en el `query` 
 * @param {Express.Response} res la respuesta que dara el servidor
 */
const usuariosGet = async(req = request, res = response) => {
    let { limite = 5, desde = 0 } = req.query;
    const query = {estado : true};

    if(desde < 0 || isNaN(Number(desde)) ) desde = 0;
    if(limite < 0 || isNaN(Number(limite)) ) limite = 1;

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query), //se cuentan solo los usuarios activos o en estado True
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        usuarios
    });
};

/**
 * Funcion que crea un usuario con los valores proporcionados en la request.
 * Responde con un objeto en el que se encuentra la informacion del usuario.
 * @async
 * @param {Express.Request} req Se debe enviar el nombre, correo, rol y contraseña del usuario que se desea crear en el `body`.
 * @param {Express.Response} res Respuesta del servidor
 */
const usuariosPost = async (req = request, res = response) => {
    

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();
    res.status(201).json({
        msg: 'post API - controlador',
        usuario
    });
};

const usuariosPatch = (req = request, res = respo) => {
    res.status(200).json({
        msg:'patch API - controlador'
    });
}

/**
 * Actualiza la informacion del usuario en la base de datos
 * @async
 * @param {Express.Request} req `HTTP request` emitida por el cliente. Debe tener el id del usuario que se desea actualizar en los `params`.
 * Tambien debe contener en el `body` lo que se desea actualizar
 * @param {Express.Response} res `HTTP response` emitida por el servidor
 */
const usuariosPut = async(req = request, res = response) => {
    const id = req.params.id;
    const {_id,password, google, ...resto} = req.body;

    if(password !== null){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(202).json({
        usuario
    });
}

/**
 * Cambia el estado al usuario indicado de la DB a false.
 * Responde con un objeto en el que se muestra el usuario.
 * @async
 * @param {Express.Request} req `HTTP request` emitida por el cliente. Debe tener el id del usuario en los `params`
 * @param {Express.Response} res `HTTP response` emitida por el servidor
 */
const usuariosDelete = async(req = request, res = response) => {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.status(200).json({
        usuario
    });
};

module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPatch,
    usuariosPut,
    usuariosDelete,
}