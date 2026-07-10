/* ==========================
   MENU BURGER MOBILE
   ========================== */

export function init_burger() {

    // Récupère le header afin d'y injecter
    // dynamiquement le menu burger
    const header = document.querySelector("header");


    // Structure HTML du bouton burger,
    // du menu mobile et de son fond assombri
    const burger_html = `
<nav class="burger">
                <div class="hamburger">
                    <div class="ligne"></div>
                    <div class="ligne"></div>
                    <div class="ligne"></div>
                </div>
                <ul class="menu_burger">
                    <li><a href="/FRONT_END/HTML/Accueil.html" title="Accueil">Accueil</a></li>
                    <li><a href="/FRONT_END/HTML/Boîtes_de_nuit.html" title="Boîtes de nuit">Boîtes de nuit</a></li>
                    <li><a href="/FRONT_END/HTML/Soirées.html" title="Soirées">Soirées</a></li>
                    <li><a href="/FRONT_END/HTML/Contact.html" title="Contact">Contact</a></li>
                    <li><a href="/FRONT_END/HTML/Admin.html" title="Espace professionnel">Espace Admin</a></li>
                </ul>
                <div class="foreground_menu"></div>
            </nav>
`;

    // Le menu burger n'existe pas dans le HTML.
    // Il est créé dynamiquement en JavaScript.
    // Ajoute le menu burger à la fin du header
    header.insertAdjacentHTML("beforeend", burger_html);


    // Récupération des éléments nécessaires
    // à l'interaction du menu
    const hamburger = document.querySelector(".hamburger");
    const menu_burger = document.querySelector(".menu_burger");
    const foreground_menu = document.querySelector(".foreground_menu");


    // Ouvre ou ferme le menu lors d'un clic
    // sur l'icône burger
    hamburger.addEventListener("click", () => {

        // Active / désactive l'affichage du menu
        menu_burger.classList.toggle("open");

        // Anime l'icône burger (croix ↔ burger)
        hamburger.classList.toggle("active");

        // Affiche ou masque l'overlay sombre
        // derrière le menu
        if (menu_burger.classList.contains("open")) {
            foreground_menu.classList.add("open");
        } else {
            foreground_menu.classList.remove("open");
        };
    });
};