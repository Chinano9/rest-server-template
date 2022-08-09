/**
 * Gestion de categorias
 * @module API-Categorias
 */
const { Router } = require('express');
const { body, param } = require('express-validator');

const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');
const { existeCategoriaPorID } = require('../helpers/db-validators')
const { crearCategoria } = require('../controllers/categorias');

const router = Router();


/**
 * Obtiene todas las categorias registradas en la base de datos
 * @name ObtenerCategorias
 */
router.get('/', );

/**
 * Obtiene una sola categoria utilizando su ID
 * @name ObtenerCategoriaPorID
 * @path {GET} api/categorias
 * @params {string} ID de la categoria
 */
router.get(':id', [
    param('id').custom( existeCategoriaPorID ),
    validarCampos
], );

/**
 * Crea una categoria en la base de datos
 * @name CrearCategoria
 * @path {POST} api/categorias
 * @body {string} nombre El nombre que recibira la categoria
 * @header {string} x-token Un JsonWebToken valido en el servidor
 * @code {200} Se creo la cateogria sin ningun problema
 * @code {401} La request no contiene un JWT valido
 * @code {400} La cateogoria que se desea crear ya existe
 * @code {500} Error interno del servidor al intentar crear la categoria
 */
router.post('/',[
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

/**
 * @name ActualizarCategoriaPorID
 * @path {PUT} api/categorias
 * @params {string} ID de la categoria
 */
router.put('/:id', [
    validarJWT,
    param('id').custom(existeCategoriaPorID),
    validarCampos
]);

/**
 * @name BorrarCategoriaPorID
 * @path {DELETE} api/categorias
 * @params {string} ID de la categoria
 */
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    param('id').custom(existeCategoriaPorID),
    validarCampos
]);


module.exports = router;