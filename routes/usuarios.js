/**
 * Rutas de usuarios
 * @module API-Usuarios
 */

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
/**
 * Obtiene los usuarios marcados como activos de la base de datos
 * @name GetUsuarios
 * @path {GET} api/usuarios/
 * @body {number} limite La cantidad de usuarios que se desea obtener desde la DB.
 * @body {number} desde El usuario desde el que se quiere empezar a obtener los demas.
 * @code {200} Se obtuvieron con exito los usuarios.
 * @response {Object} json Objeto que contiene toda la respuesta
 * @response {string} msg Mensaje de respuesta para mayor entendimiento
 * @response {string} total La cantidad de usuarios que se encuentran activos en la DB.
 * @response {Array<object>} usuarios Se proporciona la informacion de los usuarios.
 */
router.get('/', usuariosGet);

/**
 * Crea un nuevo usuario en la base de datos
 * @name CrearUsuario
 * @path {POST} api/usuarios/
 * @body {string} nombre El nombre de usuario.
 * @body {string} password Contraseña del usuario.
 * @body {string} correo Correo del usuario.
 * @body {string} rol Rol que se le asignara al usuario (Debe ser un rol valido en la DB).
 * @code {201} Se creo el usuario de manera correcta.
 * @code {400} Uno de los argumentos enviados esta mal.
 * @response {Object} json Objeto que contiene toda la respuesta
 * @response {string} msg Mensaje de respuesta para mayor entendimiento
 * @response {Array<Object>} usuarios Se proporciona la informacion del usuario.
 */
router.post('/', [
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('password', 'El password debe tener al menos 8 caracteres').isLength({ min: 8 }),
    body('correo', 'El correo no es valido').isEmail(),
    body('correo').custom(correoExiste),
    body('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

/**
 * Actualiza el usuario en la DB
 * @name ActualizarUsuario
 * @path {PUT} api/usuarios/
 * @header {string} x-token JSON Web Token valido del usuario
 * @params {string} id ID del usuario.
 * @body {string} password Contraseña del usuario.
 * @body {string} correo Correo del usuario.
 * @body {string} rol Rol que se le asignara al usuario (Debe ser un rol valido en la DB).
 * @code {202} Se actualizo el usuario de manera correcta.
 * @code {400} Uno de los argumentos enviados esta mal.
 * @code {401} El usuario no tiene, o posee un token invalido.
 * @code {403} El usuario que desea realizar esta accion esta deshabilitado en la DB.
 * @response {Object} json Objeto que contiene toda la respuesta
 * @response {Object} usuario Se proporciona la informacion del usuario.
 */
router.put('/:id', [
    validarJWT,
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeUsuarioPorID),
    body('password', 'El password debe tener al menos 8 caracteres').isLength({ min: 8 }),
    body('correo', 'El correo no es valido').isEmail(),
    body('correo').custom(correoExiste),
    body('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

/**
 * Se deshabilita un usuario de la base de datos
 * @name DeshabilitarUsuario 
 * @path {DELETE} api/usuarios/
 * @header {string} x-token JSON Web Token valido del usuario
 * @params {string} id ID del usuario.
 * @code {200} Se deshabilito el usuario de manera correcta.
 * @code {400} Uno de los argumentos enviados esta mal.
 * @code {401} El usuario no tiene, o posee un token invalido.
 * @code {403} El usuario que desea realizar esta accion esta deshabilitado en la DB.
 * @response {Object} json Objeto que contiene toda la respuesta
 * @response {string} msg Mensaje que aclara el error sucedido
 * @response {Object} usuario Se proporciona la informacion del usuario deshabilitado.
 */
router.delete('/:id', [
    validarJWT,
    // esAdminRol,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(existeUsuarioPorID),
    validarCampos
], usuariosDelete);


module.exports = router;