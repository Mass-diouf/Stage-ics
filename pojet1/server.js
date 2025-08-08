const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mass1234", 
  database: "gestion_employes",
});

db.connect(err => {
  if (err) throw err;
  console.log("Connecté à MySQL !");
});

// Route pour ajouter un employé
app.post("/api/employes", (req, res) => {
  const { matricule, prenom, nom, date_naissance, fonction, sexe } = req.body;

  const sql = `INSERT INTO employes (matricule, prenom, nom, date_naissance, fonction, sexe) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [matricule, prenom, nom, date_naissance, fonction, sexe], (err, result) => {
    if (err) {
      console.error("Erreur MySQL :", err.message);
      res.status(500).json({ error: "Erreur lors de l'ajout" });
    } else {
      res.status(201).json({ message: "Employé ajouté avec succès" });
    }
  });
});

// Récupérer un employé par son matricule
app.get("/api/employes/:matricule", (req, res) => {
  const { matricule } = req.params;

  const sql = "SELECT * FROM employes WHERE matricule = ?";
  db.query(sql, [matricule], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    res.json(results[0]); // On renvoie le premier (et unique) résultat
  });
});


//modification
app.put("/api/employes/:matricule", (req, res) => {
  const { matricule } = req.params;
  const { prenom, nom, date_naissance, fonction } = req.body;

  const sql = `
    UPDATE employes 
    SET prenom = ?, nom = ?, date_naissance = ?, fonction = ?
    WHERE matricule = ?
  `;

  db.query(sql, [prenom, nom, date_naissance, fonction, matricule], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employé non trouvé" });
    }

    res.json({ message: "Employé modifié avec succès" });
  });
});

// SUPPRESSION d’un employé par matricule
app.delete("/api/employes/:matricule", (req, res) => {
  const { matricule } = req.params;

  const sql = "DELETE FROM employes WHERE matricule = ?";
  db.query(sql, [matricule], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employé non trouvé." });
    }

    res.status(200).json({ message: "Employé supprimé avec succès." });
  });
});

app.listen(3000, () => {
  console.log("Serveur Node démarré sur http://localhost:3000");
});

