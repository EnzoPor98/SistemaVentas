const mongoose = require("mongoose");

const SaleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "La cantidad mínima a vender es 1"],
  },
  price: {
    type: Number,
    required: true,
  },
});

const SaleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // El vendedor que hace la operación
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Asociar un cliente es obligatorio"],
    },
    items: [SaleItemSchema], // Lista de productos vendidos
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Sale", SaleSchema);
