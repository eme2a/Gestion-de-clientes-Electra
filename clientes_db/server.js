const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// prueba rápida
app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

// endpoint de sincronización
app.post("/sync", (req, res) => {
  const clientes = req.body;

  if (!clientes || typeof clientes !== "object") {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  // por ahora solo devuelve lo mismo que recibe
  // (merge lo hacemos después, tranquilo)
  res.json({
    ok: true,
    clientes
  });
});

// IMPORTANTE: escuchar en 0.0.0.0
app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor clientes-db escuchando en puerto 3000");
});
