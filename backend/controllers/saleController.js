const Sale = require("../models/Sale");
const Product = require("../models/Product");

// 1. CREAR una nueva venta (POST)
exports.createSale = async (req, res) => {
  try {
    const { client, items } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "No hay productos en el carrito de venta" });
    }

    let totalCalculado = 0;
    const itemsParaGuardar = [];

    // Bucle "for...of" para poder usar operaciones asíncronas (await) correctamente
    for (const item of items) {
      // Buscar el producto original en la base de datos
      const productDB = await Product.findById(item.product);

      if (!productDB) {
        return res
          .status(404)
          .json({ message: `Producto con ID ${item.product} no encontrado` });
      }

      // Validar Stock disponible
      if (productDB.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${productDB.name}. Disponible: ${productDB.stock}, Solicitado: ${item.quantity}`,
        });
      }

      // Restar el stock del producto e impactar en la base de datos
      productDB.stock -= item.quantity;
      await productDB.save();

      // Calcular subtotal de esta línea y sumarlo al total
      totalCalculado += productDB.price * item.quantity;

      // Almacenar el item estructurado con el precio real del catálogo actual
      itemsParaGuardar.push({
        product: productDB._id,
        quantity: item.quantity,
        price: productDB.price, // Guardamos el precio del momento de la venta
      });
    }

    // Crear la venta en la base de datos asignando el vendedor autenticado (req.user)
    const sale = await Sale.create({
      user: req.user._id,
      client,
      items: itemsParaGuardar,
      total: totalCalculado,
    });

    res.status(201).json(sale);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al procesar la venta", error: error.message });
  }
};

// 2. OBTENER el historial de ventas (GET)
exports.getSales = async (req, res) => {
  try {
    // Usamos .populate() para traer los nombres reales del usuario, cliente y producto en lugar de solo ver IDs
    const sales = await Sale.find({})
      .populate("user", "name email")
      .populate("client", "name documentId")
      .populate("items.product", "name sku");
    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener historial de ventas",
      error: error.message,
    });
  }
};

// @desc    Obtener estadísticas del dashboard (Solo Admin)
// @route   GET /api/sales/dashboard
// @access  Privado/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Calcular Ingresos Totales y Total de Transacciones
    const generalStats = await Sale.aggregate([
      {
        $group: {
          _id: null, // Agrupar todas las ventas juntas
          totalIngresos: { $sum: "$total" },
          cantidadVentas: { $count: {} },
        },
      },
    ]);

    // 2. Calcular los Productos Más Vendidos
    const topProducts = await Sale.aggregate([
      { $unwind: "$items" }, // Descompone el array de items para analizar producto por producto
      {
        $group: {
          _id: "$items.product", // Agrupa por el ID del producto
          unidadesVendidas: { $sum: "$items.quantity" },
          ingresosGenerados: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { unidadesVendidas: -1 } }, // Ordena de mayor a menor cantidad
      { $limit: 5 }, // Trae solo los 5 principales
      {
        $lookup: {
          // Hace un "Join" con la colección de productos para traer el nombre real
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "detallesProducto",
        },
      },
      { $unwind: "$detallesProducto" },
      {
        $project: {
          _id: 1,
          unidadesVendidas: 1,
          ingresosGenerados: 1,
          name: "$detallesProducto.name",
          sku: "$detallesProducto.sku",
        },
      },
    ]);

    // Estructurar la respuesta final limpia
    res.json({
      totales: {
        ingresos: generalStats[0]?.totalIngresos || 0,
        ventasRealizadas: generalStats[0]?.cantidadVentas || 0,
      },
      topProductos: topProducts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al generar el reporte", error: error.message });
  }
};
