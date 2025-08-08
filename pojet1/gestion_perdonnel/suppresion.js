document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-suppression");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const matricule = document.getElementById("matricule").value.trim();

    try {
      const response = await fetch(`http://localhost:3000/api/employes/${matricule}`, {
        method: "DELETE",
      });

      if (response.ok) {
        messageDiv.textContent = " Employé supprimé avec succès.";
        messageDiv.style.color = "green";
        form.reset();
      } else if (response.status === 404) {
        messageDiv.textContent = " Employé non trouvé.";
        messageDiv.style.color = "red";
      } else {
        messageDiv.textContent = " Une erreur est survenue.";
        messageDiv.style.color = "red";
      }
    } catch (error) {
      console.error(error);
      messageDiv.textContent = "⚠️ Erreur réseau ou serveur.";
      messageDiv.style.color = "red";
    }
  });
});
