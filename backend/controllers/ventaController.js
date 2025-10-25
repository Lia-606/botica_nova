const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

// Registrar una venta
const crearVenta = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.usuario:', req.usuario);

    const { cliente, producto, cantidad } = req.body;

    if (!cliente || cliente.trim() === '') {
      return res.status(400).json({ msg: 'El cliente es obligatorio' });
    }
    if (!producto) {
      return res.status(400).json({ msg: 'El producto es obligatorio' });
    }
    const cantidadNum = Number(cantidad);
    if (!cantidadNum || cantidadNum <= 0) {
      return res.status(400).json({ msg: 'Cantidad inválida' });
    }

    const prod = await Producto.findById(producto);
    if (!prod) return res.status(404).json({ msg: 'Producto no encontrado' });

    if (cantidadNum > prod.stock) return res.status(400).json({ msg: 'Stock insuficiente' });
    if (typeof prod.precio !== 'number') return res.status(500).json({ msg: 'Producto no tiene precio definido' });

    const total = prod.precio * cantidadNum;

    // Verificar que req.usuario.id existe
    if (!req.usuario || !req.usuario.id) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    const venta = new Venta({
      cliente,
      producto,
      vendedor: req.usuario.id,
      cantidad: cantidadNum,
      total
    });
    await venta.save();

    prod.stock -= cantidadNum;
    await prod.save();

    res.status(201).json(venta);
  } catch (error) {
    console.error('Error en crearVenta:', error); // <-- esto mostrará el error real
    res.status(500).json({ msg: 'Error al crear la venta', error: error.message });
  }
};


// Obtener todas las ventas
const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('producto', 'nombre precio')
      .populate('vendedor', 'nombre correo');
    res.json(ventas);
  } catch (error) {
    console.error('Error en obtenerVentas:', error);
    res.status(500).json({ msg: 'Error al obtener las ventas' });
  }
};

// Obtener venta por ID
const obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id)
      .populate('producto', 'nombre precio')
      .populate('vendedor', 'nombre correo');
    if (!venta) return res.status(404).json({ msg: 'Venta no encontrada' });
    res.json(venta);
  } catch (error) {
    console.error('Error en obtenerVentaPorId:', error);
    res.status(500).json({ msg: 'Error al obtener la venta' });
  }
};

module.exports = {
  crearVenta,
  obtenerVentas,
  obtenerVentaPorId
};
