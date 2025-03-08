// Importando módulos
import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Criando conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());

// Rota para obter usuários
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para adicionar usuário
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const [result] = await pool.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    res.json({ id: result.insertId, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta ${PORT}");
});