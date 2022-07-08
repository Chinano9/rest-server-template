const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = (req = request, res = response) => {
    const {
        q, 
        nombre = 'No name', 
        apikey, 
        page = 7, 
        limit
    } = req.query;
    res.status(200).json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
};

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

const usuariosPut = async(req = request, res = response) => {
    const id = req.params.id;
    const {password, google, ...resto} = req.body;

    //TODO: Validar en base de datos
    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }


    res.status(200).json({
        msg: 'put API - controlador',
        id
    });
}

const usuariosDelete = (req = request, res = response) => {
    res.status(200).json({
        msg: 'delete API - controlador'
    });
};

module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPatch,
    usuariosPut,
    usuariosDelete,
}