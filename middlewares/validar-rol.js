const { response, request } = require("express");


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