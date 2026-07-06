const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true, // No puede haber dos usuarios con el mismo correo
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["admin", "vendedor"], // Solo permite estos dos roles
      default: "vendedor",
    },
    status: {
      type: Boolean,
      default: true, // Permite activar o desactivar usuarios sin borrarlos de la BD
    },
  },
  {
    timestamps: true, // Crea automáticamente los campos createdAt y updatedAt
  },
);

const bcrypt = require("bcryptjs");

// Hook pre-save: Se ejecuta ANTES de guardar el usuario en la BD
UserSchema.pre("save", async function () {
  // Si la contraseña no ha sido modificada, nos saltamos este paso
  if (!this.isModified("password")) return;

  // Encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comprobar si la contraseña ingresada es correcta
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Exportar el modelo
module.exports = mongoose.model("User", UserSchema);
