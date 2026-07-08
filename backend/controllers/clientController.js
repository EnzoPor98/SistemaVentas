const Client = require("../models/Client");

// 1. CREAR un cliente (POST)
exports.createClient = async (req, res) => {
  try {
    const { documentId, name, email, phone, address } = req.body;

    // Verificar si ya existe el cliente por su documento de identidad
    const clientExists = await Client.findOne({ documentId });
    if (clientExists) {
      return res
        .status(400)
        .json({
          message: "Ya existe un cliente registrado con este documento",
        });
    }

    const client = await Client.create({
      documentId,
      name,
      email,
      phone,
      address,
    });
    res.status(201).json(client);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar el cliente", error: error.message });
  }
};

// 2. OBTENER todos los clientes (GET)
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.json(clients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los clientes", error: error.message });
  }
};

// 3. OBTENER un cliente por ID (GET)
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(client);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar el cliente", error: error.message });
  }
};

// 4. ACTUALIZAR un cliente (PUT)
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(client);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar el cliente",
        error: error.message,
      });
  }
};

// 5. ELIMINAR un cliente (DELETE)
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado correctamente del sistema" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el cliente", error: error.message });
  }
};
