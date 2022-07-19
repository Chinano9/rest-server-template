const {Router} = require('express');
const { body } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');

const { validarCampos } = require('../middlewares/validacion-campos');

const router = Router();

router.post('/login',[
    body('correo', 'El correo es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google',[
    body('id_token', 'El id token de google es obligatorio').not().isEmpty(),
    validarCampos,
], googleSignIn);



module.exports = router;