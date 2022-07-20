/**
 * Autenticacion e inicio de sesion de usuarios en el API
 * @module API-LogIn
 */
const {Router} = require('express');
const { body } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');

const { validarCampos } = require('../middlewares/validacion-campos');

const router = Router();

/**
 * Crea un login valido usando autenticacion propia
 * @name UserLogin
 * @path {POST} api/auth/login
 * @body {string} correo Correo registrado en la base de datos en un usuario activo
 * @body {string} password Contraseña del usuario que desea registrarse.
 * @code {200} Si el usuario esta autenticado correctamente
 * @code {400} Si el usuario o contraseña no son correctos
 * @code {403} Si el usuario no esta activo en la base de datos
 * @code {500} Error interno del servidor
 * @response {Object} json Objeto que contiene toda la respuesta
 * @response {string} msg Mensaje de respuesta para mayor entendimiento
 * @response {object} usuario Informacion del usuario
 * @response {string} token JSON Web Token valido para 4 horas
 */
router.post('/login',[
    body('correo', 'El correo es obligatorio').isEmail(),
    body('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

/**
 * Crea un login valido con Google SignIn
 * @name GoogleLogin
 * @path {POST} api/auth/google
 * @body {string} id_token Token de acceso valido por Google SignIn
 * @code {200} El usuario logro autenticarse de manera satisfactoria
 * @code {400} El token fallo al ser verificado
 * @code {403} El usuario no esta activo en la base de datos
 * @response {object} json Objeto que contiene todas las respuestas
 * @response {object} usuario Retorna los datos necesarios del usuario
 * @response {string} token Token de acceso al servidor
 * @response {string} msg Mensaje del servidor
 * @response {Error} e Error ocurrido en el login
 */
router.post('/google',[
    body('id_token', 'El id token de google es obligatorio').not().isEmpty(),
    validarCampos,
], googleSignIn);



module.exports = router;