const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

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
    const {_id,password, google, ...resto} = req.body;

    if(password !== null){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(200).json({
        usuario
    });
}

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