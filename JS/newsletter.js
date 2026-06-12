/* POP-UP NEWSLETTER */
import { show_overlay, close_overlay, on_overlay_click } from "./overlay.js";

export function init_newsletter() {

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
    document.body.insertAdjacentHTML("beforeend", newsletter_html);

    /* POP-UP NEWSLETTER + OVERLAY */
    const btn_subscribe = document.querySelector(`.btn-newsletter`);
    const newsletter_container = document.querySelector(`.popnewsletter`);
    const btn_close = document.querySelector(`.newscross`);
    const newsletter_burger = document.querySelector(`.burger_sinscrire`);
    const menu_burger = document.querySelector(".menu_burger");
    const foreground_menu = document.querySelector(".foreground_menu");

    btn_subscribe.addEventListener("click", () => {
        newsletter_container.classList.add("active");
        show_overlay();
    });

    btn_close.addEventListener("click", () => {
        newsletter_container.classList.remove("active");
        close_overlay();
    });

    newsletter_burger.addEventListener("click", () => {
        newsletter_container.classList.add("active");
        show_overlay();

        const hamburger = document.querySelector(".hamburger");
        hamburger.classList.remove("active")
        menu_burger.classList.remove("open");
        foreground_menu.classList.remove("open");
    });

    on_overlay_click(() => {
        newsletter_container.classList.remove("active");
        close_overlay();
    });
};