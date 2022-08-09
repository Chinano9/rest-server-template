const { Categoria } = require('../models/')

// obtenerCategorias - paginado - total - papulate
const obtenerCategorias = (req, res) => {
    
}
// obtenerCategoria - populate {}

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
            error: "Error interno del servidor, contacte al administrador"
        })
    }
}

// actualizarCategoria

// borrarCategoria - estado:false

module.exports = {
    crearCategoria
}