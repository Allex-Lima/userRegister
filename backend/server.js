const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());

// conexão com mongoDB
mongoose
  .connect("mongodb://localhost:27017/cadastro_usuarios")
  .then(() => console.log("MongoDB conectado."))
  .catch((err) => console.error("Erro ao conectar com banco de dados", err));

const EsquemaUsuario = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  idade: {
    type: Number,
    required: true,
  },
});

const Usuario = mongoose.model("Usuario", EsquemaUsuario);

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, idade } = req.body;
    const novoUsuario = new Usuario({ nome, email, idade });

    await novoUsuario.save();

    res.status(201).json({
      mensage: "Usuário cadastrado com sucesso!",
    });
  } catch (error) {
    res.status(400).json({
      message: "Erro ao cadastrar usuário",
      details: error.message,
    });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const listaUsuarios = await Usuario.find();

    res.status(200).json({listaUsuarios});

  } catch (error) {
    res.status(400).json({
      message: "Erro ao visualizar usuário.",
      details: error.mensage,
    });
    
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, idade } = req.body;

    const atualizaUsuario = await Usuario.findOneAndUpdate(
      id, 
      { nome, email, idade, },
      { new: true }
    );

    if (!atualizaUsuario) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      message: "usuário atualizado com sucesso.",
    });

  } catch (error) {
    res.status(400).json({
      message: "Erro ao atualizar usuário",
      details: error.message,
    })
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usuarioDeletado =  await Usuario.findByIdAndDelete(id)

    if (!usuarioDeletado) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    res.status(200).json({
      message: "Usuário deletado com sucesso.",
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar o usuário",
      details: error.message,
    });
  }
});

app.get("/usuarios/filtro/:termo", async (req, res) => {
  try {
    const { termo } = req.params;

    const usuariosFiltrados = await Usuario.find({
      $or: [
        {nome: {$regex: termo, $options: 'i'}},
        {email: {$regex: termo, $options: 'i'}},
      ]
    });

    res.status(200).json({
      usuariosFiltrados,
    });

  } catch (error) {
    res.status(404).json({
      message: "Erro ao filtrar usuários",
      details: error.message,
    });
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
