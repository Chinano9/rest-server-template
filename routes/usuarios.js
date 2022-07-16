const { Router } = require('express');
const { body, param } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRol,
    tieneRol
} = require('../middlewares')

const { 
    esRolValido, 
    correoExiste, 
    existeUsuarioPorID 
} = require('../helpers/db-validators');

const { usuariosGet,
    usuariosPost, 
    usuariosPut, 
    usuariosPatch, 
    usuariosDelete 
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('password', 'El password debe tener al menos 8 caracteres').isLength({ min: 8 }),
    body('correo', 'El correo no es valido').isEmail(),
    body('correo').custom(correoExiste),
    body('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.put('/:id', [
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeUsuarioPorID),
    body('password', 'El password debe tener al menos 8 caracteres').isLength({ min: 8 }),
    body('correo', 'El correo no es valido').isEmail(),
    body('correo').custom(correoExiste),
    body('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    validarJWT,
    // esAdminRol,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeUsuarioPorID),
    validarCampos
], usuariosDelete);


module.exports = router;