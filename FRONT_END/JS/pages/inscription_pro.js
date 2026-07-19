import { init_overlay } from "../components/overlay.js";
import { init_burger } from "../components/burger.js";
import { init_newsletter } from "../components/newsletter.js";
import { scrollHeader, initBoutonEspacePro } from "../components/header.js";

document.addEventListener("DOMContentLoaded", () => {

    init_overlay();
    init_burger();
    init_newsletter();
    scrollHeader();
    initBoutonEspacePro();


    // INSCRIPTION PRO DANS LA BDD

    const formulaire = document.querySelector(`form[name="InscriptionPro"]`);

    formulaire.addEventListener("submit", async (event) => {

        event.preventDefault();

        // Le siret n'est pas encore rattaché à un compte utilisateur,
        // il sera utilisé plus tard quand le owner ajoutera sa boîte.
        const donnees = {
            email: document.querySelector("#email").value,
            password: document.querySelector("#password").value,
            newsletter: false,
            role: "owner",
            city: document.querySelector("#city").value,
            firstName: document.querySelector("#firstName").value,
            lastName: document.querySelector("#lastName").value,
            phone: document.querySelector("#phone").value
        };

        try {

            const reponse = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(donnees)
            });

            const resultat = await reponse.json();

            if (reponse.ok === false) {
                console.error(resultat.error);
                return;
            }

            window.location.href = "/FRONT_END/HTML/Connexion_pro.html";

        } catch (err) {
            console.error("Impossible de contacter le serveur :", err);
        }

    });

});