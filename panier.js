// panier.js

const contenuPanier = document.getElementById("contenuPanier");
const btnPaiement = document.getElementById("btnPaiement");
const modal = document.getElementById("modalPaiement");
const validerPaiement = document.getElementById("validerPaiement");

function getPizzas() {
  return JSON.parse(localStorage.getItem("pizzas")) || [];
}

function getQuantites() {
  return JSON.parse(localStorage.getItem("quantites")) || {};
}

function saveQuantites(quantites) {
  localStorage.setItem("quantites", JSON.stringify(quantites));
}

function saveMontantTotal(montant) {
  localStorage.setItem("montantTotal", montant.toFixed(2));
}

function afficherPanier() {
  const pizzas = getPizzas();
  const quantites = getQuantites();
  contenuPanier.innerHTML = "";
  let total = 0;

  const pizzasDansPanier = pizzas.filter(pizza => quantites[pizza.nom] > 0);

  pizzasDansPanier.forEach(pizza => {
    const card = document.createElement("div");
    card.className = "pizza-panier-card";

    const imagePath = `images/categories/${pizza.categorie.toLowerCase()}/${pizza.image}`;

    const quantite = quantites[pizza.nom];
    total += pizza.prix * quantite;

    card.innerHTML = `
      <img src="${imagePath}" alt="${pizza.nom}">
      <h3>${pizza.nom}</h3>
      <div class="quantite-control">
        <button class="moins">-</button>
        <span>${quantite}</span>
        <button class="plus">+</button>
      </div>
      <div class="prix">${pizza.prix.toFixed(2)} € x ${quantite} = ${(pizza.prix * quantite).toFixed(2)} €</div>
    `;

    const btnMoins = card.querySelector(".moins");
    const btnPlus = card.querySelector(".plus");
    const compteur = card.querySelector("span");

    btnMoins.addEventListener("click", () => {
      if (quantites[pizza.nom] > 0) {
        quantites[pizza.nom]--;
        saveQuantites(quantites);
        afficherPanier();
      }
    });

    btnPlus.addEventListener("click", () => {
      if (quantites[pizza.nom] < 20) {
        quantites[pizza.nom]++;
        saveQuantites(quantites);
        afficherPanier();
      }
    });

    contenuPanier.appendChild(card);
  });

  saveMontantTotal(total);
  btnPaiement.innerHTML = `Procéder au paiement (${total.toFixed(2)} €)`;
}

btnPaiement.addEventListener("click", () => {
  const montant = localStorage.getItem("montantTotal") || "0.00";
  modal.classList.remove("hidden");
  const totalAffiche = document.createElement("p");
  totalAffiche.style.marginTop = "1rem";
  totalAffiche.style.fontWeight = "bold";
  totalAffiche.textContent = `Total à payer : ${montant} €`;

  const modalContent = modal.querySelector(".modal-content");
  const oldTotal = modalContent.querySelector(".total-affiche");
  if (oldTotal) oldTotal.remove();
  totalAffiche.classList.add("total-affiche");
  modalContent.appendChild(totalAffiche);
});

validerPaiement.addEventListener("click", () => {
  alert("Votre commande a bien été prise en compte et vous serez livré très rapidement. Merci pour votre confiance !");
  localStorage.setItem("quantites", JSON.stringify({}));
  localStorage.removeItem("montantTotal");
  modal.classList.add("hidden");
  window.location.href = "index.html";
});

// Initialisation
afficherPanier();
