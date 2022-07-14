const {Router} = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');
const { esRolValido, correoExiste, existeUsuarioPorID } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validacion-campos');


const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener al menos 8 caracteres').isLength({ min:8 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( correoExiste ),
    check('rol').custom( esRolValido ),
    validarCampos
],usuariosPost);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorID ),
    check('password', 'El password debe tener al menos 8 caracteres').isLength({ min:8 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( correoExiste ),
    check('rol').custom( esRolValido ),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorID ),
    validarCampos
], usuariosDelete);


module.exports = router;