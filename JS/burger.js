/* BURGER */

export function init_burger() {
    const header = document.querySelector("header");

    const burger_html = `
<nav class="burger">
                <div class="hamburger">
                    <div class="ligne"></div>
                    <div class="ligne"></div>
                    <div class="ligne"></div>
                </div>
                <ul class="menu_burger">
                    <li><a href="/HTML/Accueil.html" title="Accueil">Accueil</a></li>
                    <li><a href="/HTML/Boîtes_de_nuit.html" title="Boîtes de nuit">Boîtes de nuit</a></li>
                    <li><a href="#" title="Soirées">Soirées</a></li>
                    <li><a href="/HTML/Contact.html" title="Contact">Contact</a></li>
                    <li>
                        <p class="burger_sinscrire">Ne rate aucune soirée avec notre Newsletter
                            !</p>
                    </li>
                </ul>
                <div class="foreground_menu"></div>
            </nav>
`;

    header.insertAdjacentHTML("beforeend", burger_html);

    const hamburger = document.querySelector(".hamburger");
    const menu_burger = document.querySelector(".menu_burger");
    const foreground_menu = document.querySelector(".foreground_menu");


    hamburger.addEventListener("click", () => {
        menu_burger.classList.toggle("menu_burger_active");
        hamburger.classList.toggle("hamburger_active")
        if (menu_burger.classList.contains("menu_burger_active")) {
            foreground_menu.classList.add("foreground_burger_active");
        } else {
            foreground_menu.classList.remove("foreground_burger_active");
        }
    });
};