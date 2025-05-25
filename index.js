// index.js

const filtreCategorie = document.getElementById("filtreCategorie");
const titreCategorie = document.getElementById("titreCategorie");
const listePizzas = document.getElementById("listePizzas");
const btnCommander = document.getElementById("btnCommander");
/* Explication
Ces constantes sélectionnent les éléments HTML nécessaires pour :
- Filtrer les pizzas par catégorie
- Afficher un titre de section,
- Afficher dynamiquement les cartes de pizzas
- Bouton pour accéder à la page panier.
*/


// 🔍 Création dynamique d’un champ de recherche
const champRecherche = document.createElement("input");
champRecherche.type = "text";
champRecherche.placeholder = "Rechercher une pizza...";
champRecherche.id = "recherchePizza";
champRecherche.style.padding = "0.5rem";
champRecherche.style.marginLeft = "1rem";
document.querySelector(".filtres").appendChild(champRecherche);
/* Explication
Création à la volée d’un champ de recherche avec :
- Un placeholder explicite
- Un id pour identification ultérieure
- Un peu de style CSS pour le confort visuel
- Puis ajout dans la section .filtres
*/



// 📦 Fonctions de lecture / écriture dans le localStorage
function getPizzas() {
  return JSON.parse(localStorage.getItem("pizzas")) || [];
}
/* Explication
Récupère la liste des pizzas stockée dans localStorage, ou un tableau vide si aucune pizza n’est encore enregistrée.
*/

function getCategories() {
  return JSON.parse(localStorage.getItem("categories")) || [];
}
/* Explication :
Idem pour les catégories.
*/

function getQuantites() {
  return JSON.parse(localStorage.getItem("quantites")) || {};
}
/* Explication :
Cette fonction lit les quantités choisies pour chaque pizza sous forme d’objet { nomPizza: quantité }.
*/

function saveQuantites(quantites) {
  localStorage.setItem("quantites", JSON.stringify(quantites));
}
/* Explication :
Cette fonction enregistre les quantités dans le localStorage, sous format texte avec JSON.stringify.
*/


// 📋 Chargement des catégories dans le menu déroulant
function chargerCategories() {
  const categories = getCategories();
  filtreCategorie.innerHTML = '<option value="">Toutes</option>';
  /* Explication :
  Récupère toutes les catégories disponibles, et réinitialise le <select> avec une option par défaut : “Toutes”.
  */
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filtreCategorie.appendChild(opt);
  });
  /* Explication :
  Pour chaque catégorie, on crée dynamiquement une <option> dans la liste déroulante de filtres.
  */
}


// 🍕 Affichage des pizzas selon catégorie et recherche
function afficherPizzas(categorie = "", recherche = "") {
  const pizzas = getPizzas();
  const quantites = getQuantites();
  listePizzas.innerHTML = "";
  /* Explication :
  Cette fonction : 
  - Récupère les pizzas et les quantités choisies,
  - Vide l’affichage existant pour le mettre à jour.
  */


  //------------------------------------------------------------------
  let filtres = pizzas;

  if (categorie) {
    filtres = filtres.filter(p => p.categorie === categorie);
  }

  if (recherche.trim() !== "") {
    filtres = filtres.filter(p => p.nom.toLowerCase().includes(recherche.toLowerCase()));
  }
  //---------------------------------------------------------------------
  /* Explication :
  On filtre les pizzas selon :
  - La catégorie choisie (exactement égale),
  - Le texte tapé dans le champ de recherche (insensible à la casse grâce à toLowerCase()).
  */


  titreCategorie.textContent = (categorie || recherche) ?
    `Résultats ${categorie ? ' - ' + categorie : ''}${recherche ? ' pour « ' + recherche + ' »' : ''}` :
    "Toutes les pizzas disponibles";
  /* Explication :
  Mise à jour dynamique du titre selon les filtres appliqués (catégorie, recherche ou aucun).
  */

  // 🧱 Construction dynamique des cartes de pizza
  filtres.forEach((pizza) => {
    const card = document.createElement("div");
    card.className = "pizza-card";
    /* Explication :
    Pour chaque pizza filtrée, on crée un bloc HTML de type carte (.pizza-card).
    */


    const imagePath = `images/categories/${pizza.categorie.toLowerCase()}/${pizza.image}`;
    /* Explication :
    On construit dynamiquement le chemin de l’image en fonction de la catégorie et du nom de fichier donné lors de la création de la pizza.
    */


    card.innerHTML = `
      <img src="${imagePath}" alt="${pizza.nom}">
      <h3>${pizza.nom}</h3>
      <p>${pizza.ingredients.join(", ")}</p>
      <div class="prix">${pizza.prix.toFixed(2)} €</div>
      <div class="quantite-control">
        <button class="moins">-</button>
        <span>${quantites[pizza.nom] || 0}</span>
        <button class="plus">+</button>
      </div>
    `;
    /* Explication :
    Le HTML interne de la carte affiche :
    - L’image,
    - Le nom de la pizza,
    - La liste des ingrédients (avec join(", ")),
    - Le prix au format 2 décimales,
    - Et les boutons + / - avec la quantité sélectionnée (par défaut 0).
    */

    //------------------------------------------------
    const btnMoins = card.querySelector(".moins");
    const btnPlus = card.querySelector(".plus");
    const compteur = card.querySelector("span");
    //------------------------------------------------
    /* Explication :
    On cible les boutons d’interaction et le compteur visuel dans chaque carte.
    */


    //  ➖ Diminuer la quantité de pizza
    btnMoins.addEventListener("click", () => {
      let qte = quantites[pizza.nom] || 0;
      if (qte > 0) {
        qte--;
        quantites[pizza.nom] = qte;
        compteur.textContent = qte;
        saveQuantites(quantites);
      }
    });
    /* Explication :
    Quand on clique sur "-", on diminue la quantité :
    - Sans jamais descendre en-dessous de 0.
    - Mise à jour de l'affichage et du localStorage.
    */


    //  ➕ Augmenter la quantité de pizza
    btnPlus.addEventListener("click", () => {
      let qte = quantites[pizza.nom] || 0;
      if (qte < 20) {
        qte++;
        quantites[pizza.nom] = qte;
        compteur.textContent = qte;
        saveQuantites(quantites);
      }
    });
    /* Explication :
    Le bouton "+" augmente la quantité jusqu’à un maximum de 20 pizzas (limitation métier).
    */


    listePizzas.appendChild(card);
    /* Explication :
    Chaque carte construite est ajoutée dans le conteneur général de la page.
    */
  });
}

//  🌀 Interactions sur les filtres
filtreCategorie.addEventListener("change", () => {
  champRecherche.value = "";
  afficherPizzas(filtreCategorie.value, "");
});
/* Explication :
Lorsqu’on change de catégorie :
- On efface le champ de recherche,
- Et on relance l’affichage avec le filtre de catégorie uniquement.
*/


champRecherche.addEventListener("input", () => {
  filtreCategorie.value = "";
  afficherPizzas("", champRecherche.value);
});
/* Explication :
Lorsqu’on tape dans le champ de recherche :
- On réinitialise le filtre de catégorie,
- Et on affiche les pizzas correspondant à la recherche.
*/


// 🛒 Bouton "Commander" → redirection vers panier
btnCommander.addEventListener("click", () => {
  window.location.href = "panier.html";
});
/* Explication :
Redirige l’utilisateur vers la page panier.html pour finaliser la commande.
*/


// ✅ Lancement des fonctions au chargement de la page
chargerCategories();
afficherPizzas();
/* Explication :
Affiche immédiatement les catégories et toutes les pizzas dès le chargement de la page.
*/