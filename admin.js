// admin.js

// Vérification d'accès admin
// if (sessionStorage.getItem("auth") !== "autorisation accordé") {
//   alert("Accès à la page administration interdit sans mot de passe.");
//   window.location.href = "index.html";
// }


/* Explication :
sessionStorage.getItem("auth") vérifie si l'utilisateur a été authentifié pour accéder à la page admin.
Si l’authentification n’est pas présente ou incorrecte, un message d’alerte s'affiche, et l'utilisateur est redirigé vers la page d’accueil.
*/

// Sélection des éléments HTML (DOM)
const categorieInput = document.getElementById("categorieInput");
const addCategorieBtn = document.getElementById("addCategorieBtn");
const categorieList = document.getElementById("categorieList");
const pizzaCategorie = document.getElementById("pizzaCategorie");
const pizzaName = document.getElementById("pizzaName");
const pizzaIngredients = document.getElementById("pizzaIngredients");
const pizzaPrice = document.getElementById("pizzaPrice");
const pizzaImage = document.getElementById("pizzaImage");
const addPizzaBtn = document.getElementById("addPizzaBtn");
const logoutBtn = document.getElementById("logoutBtn");
/* Explication :
Ces lignes permettent de récupérer les éléments HTML par leur id pour pouvoir interagir avec eux (ex : lire leur contenu ou ajouter des événements).
*/



// Ajout dynamique de la section des pizzas existantes
const pizzaListContainer = document.createElement("section");
pizzaListContainer.id = "pizza-list-section";
document.querySelector("main").appendChild(pizzaListContainer);
/* Explication :
On crée dynamiquement une nouvelle section pour afficher la liste des pizzas.
On lui donne un id pour pouvoir la cibler plus tard.
On l’ajoute dans le main du document.
*/



function saveCategories(categories) {
  localStorage.setItem("categories", JSON.stringify(categories));
}
/* Explication :
Cette fonction enregistre un tableau de catégories dans le localStorage.
JSON.stringify convertit le tableau en texte pour qu’il soit stockable.
*/


// 📂 Fonctions utilitaires pour le LocalStorage
function getCategories() {
  return JSON.parse(localStorage.getItem("categories")) || [];
}
/* Explication :
Cette fonction lit les catégories stockées en localStorage.
Si aucune catégorie n’est enregistrée, elle retourne un tableau vide ([]).
*/



//----------------------------------------------------------
function getPizzas() {
  return JSON.parse(localStorage.getItem("pizzas")) || [];
}
function savePizzas(pizzas) {
  localStorage.setItem("pizzas", JSON.stringify(pizzas));
}
//-----------------------------------------------------------
/* Explication :
Ces deux fonctions font la même chose que celles pour les catégories, 
mais pour les pizzas : lecture et écriture dans le localStorage.
*/



// 🔁 Met à jour la liste des catégories dans la page
function updateCategorieList() {
  const categories = getCategories();
  categorieList.innerHTML = "";
  pizzaCategorie.innerHTML = "";
  /* Explication :
  On récupère les catégories existantes.
  On vide les listes affichées dans l’interface pour les reconstruire à jour.
  */
  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.textContent = cat;
    /* Explication :
    Pour chaque catégorie, on crée un élément <li> contenant son nom.
    */
    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.onclick = () => deleteCategorie(cat);
    /* Explication :
    On crée un bouton "X" à côté de chaque catégorie.
    En cliquant dessus, on appelle deleteCategorie(cat) pour la supprimer.
    */
    li.appendChild(delBtn);
    categorieList.appendChild(li);
    /* Explication :
    On ajoute le bouton au <li>, puis le <li> à la liste visible.
    */


    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    pizzaCategorie.appendChild(option);
  });
  /* Explication :
  Pour chaque catégorie, on ajoute aussi une <option> dans le <select> de la création de pizza.
  */
}


// 🍕 Affiche les pizzas existantes
function updatePizzaList() {
  const pizzas = getPizzas();
  pizzaListContainer.innerHTML = '<h2>Pizzas existantes</h2>';
  /* Explication :
  On vide l’ancienne liste et on ajoute un titre avant d'afficher les pizzas.
  */

  pizzas.forEach((pizza, index) => {
    const div = document.createElement("div");
    div.className = "pizza-admin-item";
    /* Explication :
    Pour chaque pizza, on crée une <div> pour afficher ses infos.
    */

    div.innerHTML = `
      <strong>${pizza.nom}</strong> - ${pizza.categorie} - ${pizza.prix.toFixed(2)} €<br>
      <em>${pizza.ingredients.join(", ")}</em>
      <button data-index="${index}" class="delete-pizza">Supprimer</button>
    `;
    /* Explication :
    On affiche le nom, la catégorie, le prix formaté (.toFixed(2)) et les ingrédients (avec join(", ") pour les mettre en ligne).
    On ajoute un bouton pour supprimer.
    */
    pizzaListContainer.appendChild(div);
    /* Explication :
    On ajoute chaque pizza à la section d'affichage.
    */
  });


  document.querySelectorAll(".delete-pizza").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.index;
      const pizzas = getPizzas();
      pizzas.splice(idx, 1);
      savePizzas(pizzas);
      updatePizzaList();
    });
    /* Explication :
    On ajoute un événement click à tous les boutons "Supprimer".
    dataset.index permet de savoir quelle pizza supprimer.
    splice supprime cette pizza, puis on met à jour la liste.
    */
  });
}


//  ➕ Ajouter une nouvelle catégorie
addCategorieBtn.addEventListener("click", () => {
  const value = categorieInput.value.trim();
  /* Explication :
  Quand on clique sur le bouton "Ajouter Catégorie", on récupère et nettoie le champ de texte.
  */
  if (value) {
    const categories = getCategories();
    if (!categories.includes(value)) {
      /* Explication :
      Si l'utilisateur a entré quelque chose, on vérifie que la catégorie n’existe pas déjà (includes).
      */
      categories.push(value);
      saveCategories(categories);
      updateCategorieList();
      categorieInput.value = "";
    } else {
      alert("Cette catégorie existe déjà.");
    }
    /* Explication :
    Si elle est nouvelle, on l’ajoute, on la sauvegarde, et on met à jour la liste.
    Sinon, on affiche un message d’erreur.
    */
  }
});

// ❌ Supprimer une catégorie
function deleteCategorie(nom) {
  const categories = getCategories().filter(c => c !== nom);
  saveCategories(categories);
  updateCategorieList();
}
/* Explication :
On filtre le tableau pour exclure la catégorie à supprimer, puis on met à jour le stockage et l’affichage.
*/



// ➕ Ajouter une nouvelle pizza
addPizzaBtn.addEventListener("click", () => {
  const nom = pizzaName.value.trim();
  const categorie = pizzaCategorie.value;
  const ingredients = pizzaIngredients.value.split(",").map(i => i.trim()).filter(i => i);
  const prix = parseFloat(pizzaPrice.value);
  const image = pizzaImage.value.trim();
  /* Explication :
  On récupère tous les champs remplis par l'utilisateur.
  Les ingrédients sont transformés en tableau (split), nettoyés (trim) et filtrés (filter pour éviter les vides).
  */

  if (!nom || !categorie || ingredients.length === 0 || isNaN(prix) || prix <= 0 || !image) {
    alert("Veuillez remplir tous les champs correctement.");
    return;
  }
/* Explication :
On vérifie que tous les champs sont bien remplis.
isNaN(prix) vérifie que le prix est un nombre.
*/


  const pizzas = getPizzas();
  pizzas.push({ nom, categorie, ingredients, prix, image });
  savePizzas(pizzas);
  /* Explication :
  On ajoute la nouvelle pizza à la liste existante, puis on la sauvegarde.
  */

  pizzaName.value = "";
  pizzaIngredients.value = "";
  pizzaPrice.value = "";
  pizzaImage.value = "";
  alert("Pizza ajoutée avec succès !");
  updatePizzaList();
  /* Explication :
  On vide les champs du formulaire, on affiche une confirmation, et on met à jour la liste affichée.
  */
});


// 🔓 Déconnexion
logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("auth");
  window.location.href = "index.html";
});
/* Explication :
On supprime l’autorisation d’accès et on redirige vers l'accueil.
*/

// 🟢 Initialisation au chargement de la page
updateCategorieList();
updatePizzaList();
/* 
Explication :
On affiche les données existantes (catégories + pizzas) dès que la page est chargée.
*/
