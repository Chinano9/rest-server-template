const { Categoria } = require('../models/')

/**
 * Obteiene las categorias de la DB y las muestra paginadas
 * @param {Express.Request} req Debe contener en el query `limite` y `desde` como numeros
 * @param {Express.Response} res Respuesta del servidor al cliente
 * @returns {void} 
 */
const obtenerCategorias = async (req, res) => {
    try {
        const { limite = 1, desde = 0 } = req.query;
        const query = { estado: true };

        if (desde < 0 || isNaN(desde)) {
            res.json({ msg: '"desde" debe ser un valor numerico positivo' });
            return;
        }
        if (limite < 0 || isNaN(limite)) {
            res.json({ msg: '"limite" debe ser un valor numerico positivo' });
            return;
        }

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .skip(desde)
                .limit(limite)
                .populate('creador')
        ]);
        res.json({ total, categorias });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de servidor, favor de comunicarse con el desarrollador' });
    }
}

/**
 * Obtiene una categoria de la DB usando el parametro `id` enviado en la `request`
 * @param {Express.Request} req Debe contener en sus params el `id` de la categoria que se desea obtener
 * @param {Express.Response} res Respuesta del servidor al cliente
 */
const obtenerCategoria = async (req, res) => {
    try {
        const id = req.params.id;

        const categoria = await Categoria.findById(id)
            .populate('creador');

        res.json({
            categoria
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de servidor, favor de comunicarse con el desarrollador' });
    }
}

/**
 * Crea una categoria en la DB si esta no existe antes
 * @param {*} req Debe contener en el body el valor `nombre`
 * @param {*} res 
 * @returns {void}
 */
const crearCategoria = async (req, res) => {
    const nombre = req.body.nombre.toUpperCase();
    try {

        const categoriaDB = await Categoria.findOne({ nombre });

        if (categoriaDB !== null) {
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre} ya existe`
            });
        }
        //Generar la data a guardar

        const data = {
            nombre,
            creador: req.usuario._id
        }

        const categoria = new Categoria(data);

        await categoria.save();

        res.status(201).json(categoria);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Error interno del servidor, contacte al administrador'
        })
    }
}

// actualizarCategoria
const actualizarCategoria = async (req, res) => {
    try {
        const id = req.params.id;
        const nombre = req.body.nombre.toUpperCase()
        await Categoria.findByIdAndUpdate(id, {nombre, creador: req.usuario._id}, err => {
            console.log(err);
            res.status(404).json({ msg: 'No se encuentra la categoria seleccionada' });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error interno del servidor, contacte al administrador' });
    }
}

// borrarCategoria - estado:false
const borrarCategoria = async (req, res) => {
    try {
        const id = req.params.id;
        await Categoria.findByIdAndUpdate(id, {estado: false}, err => {
            res.status(404).json({ msg: 'No se encuentra la categoria seleccionada' });
        });

        res.json({ msg: 'Categoria borrada de manera satisfactoria' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error interno del servidor, contacte al administrador' });
    }
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    borrarCategoria,
    actualizarCategoria
}