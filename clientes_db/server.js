
const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const DB_FILE = "/data/clientes.json";

function loadDB() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/clientes", (req, res) => {
  res.json(loadDB());
});

app.post("/sync", (req, res) => {
  const incoming = req.body || [];
  const db = loadDB();

  const map = {};
  db.forEach(c => map[c.nombre] = c);
  incoming.forEach(c => map[c.nombre] = { ...map[c.nombre], ...c });

  const merged = Object.values(map);
  saveDB(merged);
  res.json({ ok: true, total: merged.length });
});

app.listen(3000, () => {
  console.log("Clientes DB escuchando en puerto 3000");
});
