// server.js
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "mass1234",
  database: process.env.DB_NAME || "pharmacie"
};

// Config nodemailer (optionnel)
let mailer = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  const nodemailer = require("nodemailer");
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  console.log("Mailer configuré");
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); // dossier public pour HTML/CSS/JS

// Connexion MySQL (pool)
const db = mysql.createPool(DB_CONFIG);

// Fonction alerte email stock bas (optionnelle)
async function sendLowStockEmail(medic) {
  if (!mailer) return;
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ALERT_TO || process.env.SMTP_USER,
    subject: `Alerte stock bas : ${medic.nom}`,
    text: `Le médicament "${medic.nom}" a un stock faible : ${medic.stock} unité(s).`
  };
  try {
    await mailer.sendMail(mailOptions);
    console.log("Alerte email envoyée pour", medic.nom);
  } catch (err) {
    console.error("Erreur envoi email:", err);
  }
}

// --- ROUTES API ---

// GET /medicaments : liste des médicaments
app.get("/medicaments", (req, res) => {
  db.query("SELECT * FROM medicaments ORDER BY id DESC", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur base de données");
    }
    res.json(results);
  });
});

// POST /medicaments : ajout médicament
app.post("/medicaments", (req, res) => {
  const { nom, prix, stock } = req.body;
  if (!nom || prix == null || stock == null) return res.status(400).send("Champs manquants");
  if (isNaN(prix) || isNaN(stock) || prix < 0 || stock < 0) return res.status(400).send("Valeurs invalides");

  const sql = "INSERT INTO medicaments (nom, prix, stock) VALUES (?, ?, ?)";
  db.query(sql, [nom, prix, stock], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur insertion");
    }

    if (stock < 3) sendLowStockEmail({ nom, stock });

    res.send("Médicament ajouté");
  });
});

// PUT /medicaments/:id : modifier médicament
app.put("/medicaments/:id", (req, res) => {
  const { id } = req.params;
  const { nom, prix, stock } = req.body;
  if (!nom || prix == null || stock == null) return res.status(400).send("Champs manquants");
  if (isNaN(prix) || isNaN(stock) || prix < 0 || stock < 0) return res.status(400).send("Valeurs invalides");

  const sql = "UPDATE medicaments SET nom=?, prix=?, stock=? WHERE id=?";
  db.query(sql, [nom, prix, stock, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur mise à jour");
    }

    if (stock < 3) sendLowStockEmail({ nom, stock });

    res.send("Médicament modifié");
  });
});

// DELETE /medicaments/:id : supprimer médicament
app.delete("/medicaments/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM medicaments WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur suppression");
    }
    res.send("Médicament supprimé");
  });
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Base de données: ${DB_CONFIG.user}@${DB_CONFIG.host}/${DB_CONFIG.database}`);
});
