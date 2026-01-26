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

app.post("/", async (req, res) => {
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
      details: Error.mensage,
    });
  }
});

app.get("/", (req, res) => {
  res.send("API RODANDO");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
