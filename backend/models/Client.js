const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentId: {
      type: String,
      required: [
        true,
        "El documento de identidad (DNI/Cédula/RFC) es obligatorio",
      ],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "El nombre del cliente es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Client", ClientSchema);
