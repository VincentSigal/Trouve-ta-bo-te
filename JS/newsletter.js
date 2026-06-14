/* ==========================
   POPUP NEWSLETTER
   ========================== */
// La popup n'existe pas dans le HTML.
// Elle est générée dynamiquement au chargement de la page.

import { show_overlay, close_overlay, on_overlay_click } from "./overlay.js";

export function init_newsletter() {

    // Structure HTML complète de la popup
    const newsletter_html = `
<section class="popnewsletter">
                <div class="newscross">
                    <div class="newsligne"></div>
                    <div class="newsligne"></div>
                </div>
                <div class="slogannews">
                    <img src="/img/logo.png" alt="Logo Trouve ta boîte">
                    <p>Trouve ta boîte</p>
                </div>
                <div class="traitnews1"></div>
                <h2>Inscription à la newsletter !</h2>
                <div class="traitnews2"></div>
                <div class="pnews">
                    <p>Ne manque aucune des <span class="bold">meilleures soirées !</span></p>
                    <p>Inscris-toi à notre newsletter et reçoit en <span class="bold">exclusivité :</span></p>
                </div>
                <ul>
                    <li><span class="bold">Offres et préventes</span>en avant-première</li>
                    <li><span class="bold">Invitations VIP</span></li>
                    <li><span class="bold">Bons plans et évènements</span>près de chez toi</li>
                </ul>

                <form name="Newsletter" action="#" method="post">
                    <label for="selectnews">Choisis tes boîtes préférées</label>
                    <select name="" id="selectnews">
                        <option value="" disabled selected>Boîtes de nuit</option>
                        <option>L'Amnesia</option>
                        <option>La Dune</option>
                        <option>L'Entrepôt</option>
                        <option>Le Pulp</option>
                    </select>
                    <div class="divmail">
                        <div>
                            <img src="/img/icons/mailnews_icon.svg" alt="Logo email">
                        </div>
                        <input type="email" name="emailnews" placeholder="Ton adresse email" title="Email" required>
                    </div>
                    <button type="submit">S'inscrire</button>
                    <div class="divcheck">
                        <input type="checkbox" name="checkboxnews" id="checkboxnews">
                        <label for="checkboxnews">J'accepte la politique de confidentialité.</label>
                    </div>
                    <div class="traitnews3"></div>
                    <p>Pas de spam, désinscription à tout moment.</p>
                </form>
            </section>`;

    // Ajoute la popup à la fin du body
    document.body.insertAdjacentHTML("beforeend", newsletter_html);


    /* ==========================
       RECUPERATION DES ELEMENTS
       ========================== */

    // Bouton newsletter du site
    const btn_subscribe = document.querySelector(`.btn-newsletter`);

    // Conteneur principal de la popup
    const newsletter_container = document.querySelector(`.popnewsletter`);

    // Bouton de fermeture de la popup
    const btn_close = document.querySelector(`.newscross`);

    // Lien newsletter présent dans le menu burger
    const newsletter_burger = document.querySelector(`.burger_sinscrire`);
    const menu_burger = document.querySelector(".menu_burger");
    const foreground_menu = document.querySelector(".foreground_menu");


    /* ==========================
       OUVERTURE DE LA POPUP
       ========================== */

    btn_subscribe.addEventListener("click", () => {

        // Affiche la popup
        newsletter_container.classList.add("active");

        // Affiche l'arrière-plan assombri
        show_overlay();
    });

    /* ==========================
           FERMETURE DE LA POPUP
           ========================== */

    btn_close.addEventListener("click", () => {

        // Masque la popup
        newsletter_container.classList.remove("active");

        // Masque l'overlay
        close_overlay();
    });

    /* ==========================
           OUVERTURE DEPUIS LE BURGER
           ========================== */

    newsletter_burger.addEventListener("click", () => {

        // Affiche la popup newsletter
        newsletter_container.classList.add("active");

        // Active l'overlay
        show_overlay();

        // Ferme automatiquement le menu burger
        // afin d'éviter d'avoir les deux
        // interfaces ouvertes en même temps
        const hamburger = document.querySelector(".hamburger");
        hamburger.classList.remove("active")
        menu_burger.classList.remove("open");
        foreground_menu.classList.remove("open");
    });


    /* ==========================
       FERMETURE VIA L'OVERLAY
       ========================== */

    // Ferme également la popup lorsqu'on
    // clique sur l'arrière-plan assombri
    on_overlay_click(() => {
        newsletter_container.classList.remove("active");
        close_overlay();
    });
};