const { Categoria } = require('../models/')

// obtenerCategorias - paginado - total - papulate
const obtenerCategorias = async(req, res) => {
        try {
            const { limite = 10, desde = 0 } = req.query;
            const query = { estado: true };

            if (desde < 0 || isNaN(Number(desde))) res.json({ msg: 'desde debe ser un valor numerico posotivo' });
            if (limite < 0 || isNaN(Number(limite))) res.json({ msg: 'limite debe ser un valor numerico posotivo' });

            const [total, categorias] = await Promise.all([
                Categorias.countDocuments(query),
                Categorias.find(query)
                .skip(desde)
                .limit(limite)
            ]);
            res.json(total, categorias);
        } catch (error) {
            console.log(error);
            res.code(500).json({ msg: "Error de servidor, favor de comunicarse con el desarrollador" });
        }
    }
    // obtenerCategoria - populate {}

const crearCategoria = async(req, res) => {
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
            error: "Error interno del servidor, contacte al administrador"
        })
    }
}

// actualizarCategoria
const actualizarCategoria = async(req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.send(500).json({ msg: 'Error interno del servidor, contacte al administrador' });
    }
}

// borrarCategoria - estado:false
const borrarCategoria = async(req, res) => {
    try {
        const id = req.body.id;
        
    } catch (error) {
        
    }
}

module.exports = {
    crearCategoria
}