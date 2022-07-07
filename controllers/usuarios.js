const {response, request} = require('express');

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

const usuariosPost = (req = request, res = response) => {
    const {nombre,edad} = req.body;
    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
};

const usuariosPatch = (req = request, res = respo) => {
    res.status(200).json({
        msg:'patch API - controlador'
    });
}

const usuariosPut = (req = request, res = response) => {
    const id = req.params.id;
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