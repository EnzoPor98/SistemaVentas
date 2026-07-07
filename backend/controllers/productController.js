const Product = require("../models/Product");

// 1. CREAR PRODUCTO.
exports.createProduct = async (req, res) => {
  try {
    const { sku, name, description, price, stock } = req.body;

    const skuExists = await Product.findOne({ sku });
    if (skuExists) {
      return res
        .status(400)
        .json({ message: "Ya existe un producto con este SKU" });
    }

    const product = await Product.create({
      sku,
      name,
      description,
      price,
      stock,
    });
    res.status(201).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear producto.", error: error.message });
  }
};

//2. LEER TODOS LOS PRODUCTOS.
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al leer los productos.", error: error.message });
  }
};

//3. LEER UN PRODUCTO.
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(400).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al leer el producto.", error: error.message });
  }
};

//4. ACTUALIZAR PRODUCTO.
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Devuelve el producto ya modificado
      runValidators: true, // Obliga a respetar las validaciones del modelo (ej: no precios negativos)
    });
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el producto.",
      error: error.message,
    });
  }
};

//5. ELIMINAR PRODUCTO.
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente del inventario" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar producto", error: error.message });
  }
};
