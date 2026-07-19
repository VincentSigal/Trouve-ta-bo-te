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

    const formulaire = document.querySelector(`form[name="ConnexionPro"]`);

    formulaire.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const seSouvenir = document.querySelector("#remember").checked;

        try {

            const reponse = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const resultat = await reponse.json();

            if (reponse.ok === false) {
                console.error(resultat.error);
                return;
            }

            // Case "Se souvenir de moi" cochée -> le token survit à la
            // fermeture du navigateur (localStorage). Sinon, il disparaît
            // à la fermeture de l'onglet (sessionStorage).
            const stockage = seSouvenir ? localStorage : sessionStorage;

            stockage.setItem("token", resultat.token);
            stockage.setItem("user", JSON.stringify(resultat.user));

            window.location.href = "/FRONT_END/HTML/Espace_pro.html";

        } catch (err) {
            console.error("Impossible de contacter le serveur :", err);
        }

    });
});