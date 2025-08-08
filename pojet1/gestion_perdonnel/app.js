document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-ajout");
  const tableEmployes = []; // tableau global

  class Employe {
    constructor(matricule, prenom, nom, date_naissance, fonction, sexe) {
      this.matricule = matricule;
      this.prenom = prenom;
      this.nom = nom;
      this.date_naissance = date_naissance;
      this.fonction = fonction;
      this.sexe = sexe;
    }

    afficher() {
      const tableau = document.querySelector("#table-employes tbody");
      const ligne = document.createElement("tr");

      ligne.innerHTML = `
        <td>${this.matricule}</td>
        <td>${this.prenom}</td>
        <td>${this.nom}</td>
        <td>${this.sexe}</td>
        <td>${this.date_naissance}</td>
        <td>${this.fonction}</td>
      `;

      tableau.appendChild(ligne);
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const matricule = document.getElementById("matricule").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const naissance = document.getElementById("naissance").value;
    const fonction = document.getElementById("fonction").value.trim();
    const sexeInput = document.querySelector('input[name="sexe"]:checked');
    const sexe = sexeInput ? sexeInput.value : "";

    // Vérification des champs vides
    if (!matricule || !prenom || !nom || !naissance || !fonction || !sexe) {
      alert(" Veuillez remplir tous les champs !");
      return;
    }

    // Vérification des doublons par matricule
    const existe = tableEmployes.some(emp => emp.matricule === matricule);
    if (existe) {
      alert("Un employé avec ce matricule existe déjà !");
      return;
    }

    //  Création et ajout
    const emp = new Employe(matricule, prenom, nom, naissance, fonction, sexe);
    tableEmployes.push(emp);
    fetch("http://localhost:3000/api/employes", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(emp),
})
.then(response => response.json())
.then(data => {
  console.log("Réponse du serveur :", data);
})
.catch(error => {
  console.error("Erreur lors de l'envoi :", error);
});

    emp.afficher();
    form.reset();
  });
});
