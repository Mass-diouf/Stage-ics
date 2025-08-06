
document.addEventListener("DOMContentLoaded", function () {

  
  const form = document.getElementById("form-ajout");

 
  form.addEventListener("submit", function (e) {
    e.preventDefault(); 

    
    const matricule = document.getElementById("matricule").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const naissance = document.getElementById("naissance").value;
    const fonction = document.getElementById("fonction").value.trim();

  
    const sexe = document.querySelector('input[name="sexe"]:checked');
    const sexeValue = sexe ? sexe.value : "";

    
    console.log("Matricule:", matricule);
    console.log("Prénom:", prenom);
    console.log("Nom:", nom);
    console.log("Sexe:", sexeValue);
    console.log("Date de naissance:", naissance);
    console.log("Fonction:", fonction);

 

 
    const tableau = document.querySelector("#table-employes tbody");
    const ligne = document.createElement("tr");

    ligne.innerHTML = `
        <td>${matricule}</td>
        <td>${prenom}</td>
        <td>${nom}</td>
        <td>${sexe}</td>
        <td>${naissance}</td>
        <td>${fonction}</td>
    `;

    tableau.appendChild(ligne);

    
    document.getElementById("form-ajout").reset();



  });
});
