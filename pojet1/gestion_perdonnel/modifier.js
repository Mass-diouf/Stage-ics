const API_URL = "http://localhost:3000/api/employes/";

function chercherEmploye() {
  const matricule = document.getElementById("recherche-matricule").value.trim();
  const message = document.getElementById("message");
  const form = document.getElementById("form-modifier");

  if (!matricule) {
    message.textContent = "Veuillez entrer un matricule.";
    form.style.display = "none";
    return;
  }

  fetch(API_URL + matricule)
    .then(response => {
      if (!response.ok) throw new Error("Employé non trouvé");
      return response.json();
    })
    .then(data => {
      document.getElementById("matricule").value = data.matricule;
      document.getElementById("prenom").value = data.prenom;
      document.getElementById("nom").value = data.nom;
      document.getElementById("date_naissance").value = data.date_naissance;
      document.getElementById("fonction").value = data.fonction;

      message.textContent = "";
      form.style.display = "block";
    })
    .catch(err => {
      message.textContent = "❌ " + err.message;
      form.style.display = "none";
    });
}

function modifierEmploye(event) {
  event.preventDefault();

  const matricule = document.getElementById("matricule").value;
  const updatedData = {
    prenom: document.getElementById("prenom").value,
    nom: document.getElementById("nom").value,
    date_naissance: document.getElementById("date_naissance").value,
    fonction: document.getElementById("fonction").value,
  };

  fetch(API_URL + matricule, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedData)
  })
    .then(response => {
      if (!response.ok) throw new Error("Échec de la mise à jour");
      return response.json();
    })
    .then(() => {
      alert("✅ Employé modifié avec succès !");
      document.getElementById("form-modifier").reset();
      document.getElementById("form-modifier").style.display = "none";
    })
    .catch(err => {
      alert("❌ " + err.message);
    });
}
