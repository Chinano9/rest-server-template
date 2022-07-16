const validarCampos = require('../middlewares/validacion-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-rol');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles
}