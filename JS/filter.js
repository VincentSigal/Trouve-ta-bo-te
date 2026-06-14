/* ==========================
   FILTRAGE DES BOÎTES
   ========================== */

import { boites } from "../data/data_cards.js";
import { renderCards } from "./cards_boites.js";
import { refreshCarrousel } from "./carrousel.js";

export function init_filter() {

    // Récupération des éléments du formulaire
    const villeSelect = document.querySelector("#ville");
    const musiqueSelect = document.querySelector("#musique");
    const filterBtn = document.querySelector("#btn-filter");

    // Lance le filtrage au clic sur le bouton
    filterBtn.addEventListener("click", () => {

        // Valeurs sélectionnées par l'utilisateur
        const ville = villeSelect.value;
        const musique = musiqueSelect.value;

        // Conserve uniquement les boîtes correspondant
        // aux critères sélectionnés
        const resultatFiltre = boites.filter((boite) => {

            // Si "Toutes les villes" est sélectionné,
            // toutes les villes sont acceptées.
            // Sinon la ville de la boîte doit correspondre.
            const villeOk =
                ville === "Toutes les villes"
                || boite.location.location_name === ville;

            // Même logique pour la musique
            const musiqueOk =
                musique === "Toutes les musiques"
                || boite.music === musique;

            // La boîte est conservée uniquement si
            // les deux critères sont respectés
            return villeOk && musiqueOk;
        });

        // Vérifie si un message d'erreur existe déjà
        const errorMessage = document.querySelector(".error-filter");

        // Aucun résultat trouvé
        if (resultatFiltre.length === 0) {

            // Évite de créer plusieurs fois
            // le même message d'erreur
            if (!errorMessage) {

                // Affiche un message sous les filtres
                document.querySelector(".club-filters").insertAdjacentHTML(
                    "afterend",
                    `<p class="error-filter">
                Aucune boîte ne correspond à votre recherche.
            </p>`
                );

            }

            // Supprime les dots du carrousel
            document.querySelector(".carousel-pagination").innerHTML = "";

            // Arrête l'exécution :
            // inutile de recréer les cartes
            // puisqu'il n'y a aucun résultat
            return;
        };

        // Supprime l'ancien message d'erreur
        // si des résultats sont trouvés
        if (errorMessage) {
            errorMessage.remove();
        }
        
        // Affiche les cartes filtrées
        renderCards(resultatFiltre);

        // Réinitialise le carrousel
        // (index, dots, calculs...)
        refreshCarrousel();
    });
};