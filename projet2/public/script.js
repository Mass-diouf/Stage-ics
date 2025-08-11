document.addEventListener("DOMContentLoaded", () => {

  /* ---------- LOGIN (login.html) ---------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Authentification simple (à améliorer côté serveur)
      if (username === "admin" && password === "1234") {
        window.location.href = "admin.html";
      } else {
        const err = document.getElementById("errorMsg");
        if (err) err.textContent = "Identifiants incorrects";
      }
    });
  }

  /* ---------- ADMIN (admin.html) ---------- */
  const addMedicForm = document.getElementById("addMedicForm");
  const tableBody = document.getElementById("medicTableBody");
  const notifications = document.getElementById("notifications");

  function showNotification(message, type = "info", autoHide = true) {
    if (!notifications) {
      alert(message);
      return;
    }
    notifications.style.display = "block";
    notifications.textContent = message;
    notifications.className = ""; // reset classes
    notifications.classList.add("notification", `notification-${type}`);
    if (autoHide) {
      setTimeout(() => {
        notifications.style.opacity = "1";
        notifications.style.transition = "opacity 0.4s";
        notifications.style.opacity = "0";
        setTimeout(() => {
          notifications.style.display = "none";
          notifications.style.opacity = "1";
        }, 400);
      }, 3000);
    }
  }

  async function loadMedics() {
    if (!tableBody) return;
    try {
      const res = await fetch("/medicaments");
      if (!res.ok) throw new Error("Erreur chargement médicaments");
      const data = await res.json();

      tableBody.innerHTML = "";
      let lowStockFound = false;

      data.forEach(medic => {
        const isLow = Number(medic.stock) < 3;
        if (isLow) lowStockFound = true;

        const tr = document.createElement("tr");
        if (isLow) tr.classList.add("low-stock-row");

        tr.innerHTML = `
          <td class="cell-name"><input class="input-name" value="${escapeHtml(medic.nom)}"></td>
          <td class="cell-cat">Catégorie à définir</td>
          <td class="cell-price"><input type="number" class="input-price" value="${medic.prix}"></td>
          <td class="cell-stock"><input type="number" class="input-stock" value="${medic.stock}"></td>
          <td class="cell-actions">
            <button class="btn-update">✏️ Modifier</button>
            <button class="btn-delete">🗑️ Supprimer</button>
          </td>
        `;

        // Modifier un médicament
        tr.querySelector(".btn-update").addEventListener("click", async () => {
          const name = tr.querySelector(".input-name").value.trim();
          const price = Number(tr.querySelector(".input-price").value);
          const stock = Number(tr.querySelector(".input-stock").value);

          if (!name || isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
            showNotification("Valeurs invalides pour la modification", "error");
            return;
          }

          try {
            const id = medic.id;
            const r = await fetch(`/medicaments/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nom: name, prix: price, stock })
            });
            if (!r.ok) throw new Error(await r.text());
            showNotification("Médicament modifié", "success");
            await loadMedics();
          } catch (err) {
            console.error(err);
            showNotification("Erreur lors de la modification", "error");
          }
        });

        // Supprimer un médicament
        tr.querySelector(".btn-delete").addEventListener("click", async () => {
          if (!confirm("Voulez-vous vraiment supprimer ce médicament ?")) return;
          try {
            const res = await fetch(`/medicaments/${medic.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await res.text());
            showNotification("Médicament supprimé", "success");
            await loadMedics();
          } catch (err) {
            console.error(err);
            showNotification("Erreur lors de la suppression", "error");
          }
        });

        tableBody.appendChild(tr);
      });

      if (lowStockFound) {
        showNotification("⚠️ Certains médicaments ont un stock inférieur à 3 !", "warning", false);
      } else if (notifications) {
        notifications.style.display = "none";
      }

    } catch (err) {
      console.error(err);
      showNotification("Impossible de charger la liste des médicaments", "error");
    }
  }

  if (addMedicForm) {
    addMedicForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nameRaw = document.getElementById("medicName").value.trim();
      const priceRaw = document.getElementById("medicPrice").value;
      const stockRaw = document.getElementById("medicStock").value;

      if (nameRaw === "" || priceRaw === "" || stockRaw === "") {
        showNotification("Veuillez remplir tous les champs", "error");
        return;
      }

      const price = Number(priceRaw);
      const stock = Number(stockRaw);

      if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
        showNotification("Prix et stock doivent être des nombres positifs", "error");
        return;
      }

      try {
        const res = await fetch("/medicaments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: nameRaw, prix: price, stock })
        });
        if (!res.ok) throw new Error(await res.text());
        showNotification("Médicament ajouté", "success");
        addMedicForm.reset();
        await loadMedics();
      } catch (err) {
        console.error(err);
        showNotification("Erreur lors de l'ajout", "error");
      }
    });
  }

  if (tableBody) loadMedics();

  /* ---------- (index.html) ---------- */
  
  /* ---------- Helpers ---------- */
  function escapeHtml(text) {
    if (typeof text !== "string") return text;
    return text.replace(/[&<>"']/g, (m) => {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

});
