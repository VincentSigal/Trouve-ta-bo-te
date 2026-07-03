/* ==========================
   ARRAY SOIRÉES (DONNÉES FACTICES)
   En attendant le vrai backend,
   ces soirées sont générées avec des
   dates toujours proches d'aujourd'hui
   pour pouvoir tester le calendrier.
   ========================== */

// Petite fonction qui renvoie la date d'aujourd'hui
// + un certain nombre de jours, au format "AAAA-MM-JJ"
function dansXJours(nombreDeJours) {
    const date = new Date();
    date.setDate(date.getDate() + nombreDeJours);

    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, "0");
    const jour = String(date.getDate()).padStart(2, "0");

    return `${annee}-${mois}-${jour}`;
}

export let events = [
    {
        idEvent: 1,
        idClub: 2, // L'AMNESIA
        name: "Soirée Ouverture de Saison",
        date: dansXJours(0),
        heure: "23h59",
        price: "20€",
        description: "La soirée d'ouverture de saison à L'Amnesia, avec les meilleurs DJ pop du moment.",
        poster: "/FRONT_END/img/amnesia/amnesia.png",
    },
    {
        idEvent: 2,
        idClub: 8, // Dieze Warehouse
        name: "Techno Night",
        date: dansXJours(0),
        heure: "00h00",
        price: "15€",
        description: "Une nuit entière dédiée à la techno underground, dans l'ambiance brute du Dieze Warehouse.",
        poster: "/FRONT_END/img/dieze/dieze.jpg",
    },
    {
        idEvent: 3,
        idClub: 1, // LA DUNE
        name: "Sunset Rooftop",
        date: dansXJours(0),
        heure: "19h00",
        price: "Gratuit avant 23h",
        description: "Profitez du coucher de soleil sur le rooftop de La Dune avant que la soirée ne commence.",
        poster: "/FRONT_END/img/la_dune/la_dune.png",
    },
    {
        idEvent: 4,
        idClub: 3, // L'ENTREPÔT
        name: "Showcase Afro",
        date: dansXJours(0),
        heure: "23h00",
        price: "18€",
        description: "Un showcase exceptionnel mêlant afrobeat, dancehall et shatta toute la nuit.",
        poster: "/FRONT_END/img/entrepot/lentrepot.png",
    },
    {
        idEvent: 5,
        idClub: 12, // Mélomane Club
        name: "Hard Techno Session",
        date: dansXJours(4),
        heure: "23h30",
        price: "20€",
        description: "Une session hard techno intense avec les meilleurs DJ de la scène locale.",
        poster: "/FRONT_END/img/melomane/melomane.webp",
    },
    {
        idEvent: 6,
        idClub: 5, // BORA CLUB
        name: "Beach Party",
        date: dansXJours(5),
        heure: "22h00",
        price: "15€",
        description: "Une soirée festive dans le jardin et le lounge privé du Bora Club.",
        poster: "/FRONT_END/img/bora/bora.jpg",
    },
    {
        idEvent: 7,
        idClub: 9, // Rockstore
        name: "Concert + Boîte de nuit",
        date: dansXJours(6),
        heure: "20h00",
        price: "25€",
        description: "Concert suivi d'une soirée boîte de nuit dans la salle mythique de Montpellier.",
        poster: "/FRONT_END/img/rockstore/rockstore.webp",
    },
    {
        idEvent: 8,
        idClub: 4, // LE PULP
        name: "Soirée à thème Bouddha Bar",
        date: dansXJours(7),
        heure: "23h00",
        price: "20€",
        description: "Une soirée à thème inspirée de l'ambiance lounge du Pulp, dans son patio orné de palmiers.",
        poster: "/FRONT_END/img/le_pulp/le_pulp.png",
    },
    {
        idEvent: 9,
        idClub: 2, // L'AMNESIA
        name: "Pop Party",
        date: dansXJours(8),
        heure: "23h30",
        price: "20€",
        description: "Une soirée pop endiablée avec les plus gros tubes du moment.",
        poster: "/FRONT_END/img/amnesia/amnesia.png",
    },
    {
        idEvent: 10,
        idClub: 6, // CLUB CASITA
        name: "Open Format Night",
        date: dansXJours(9),
        heure: "23h00",
        price: "18€",
        description: "Hip-hop, électro, rock et house se mélangent pour une nuit éclectique au Club Casita.",
        poster: "/FRONT_END/img/casita/casita.jpg",
    },
    {
        idEvent: 11,
        idClub: 8, // Dieze Warehouse
        name: "Techno Warehouse Vol.2",
        date: dansXJours(10),
        heure: "00h00",
        price: "15€",
        description: "Le retour de la soirée techno la plus attendue du mois.",
        poster: "/FRONT_END/img/dieze/dieze.jpg",
    },
    {
        idEvent: 12,
        idClub: 1, // LA DUNE
        name: "Soirée 25 ans et +",
        date: dansXJours(11),
        heure: "23h00",
        price: "20€",
        description: "Une soirée pensée pour une clientèle un peu plus mature, dans une ambiance chic.",
        poster: "/FRONT_END/img/la_dune/la_dune.png",
    },
    {
        idEvent: 13,
        idClub: 3, // L'ENTREPÔT
        name: "Danse de Salon",
        date: dansXJours(12),
        heure: "21h00",
        price: "10€",
        description: "La traditionnelle soirée danse de salon hebdomadaire de L'Entrepôt.",
        poster: "/FRONT_END/img/entrepot/lentrepot.png",
    },
    {
        idEvent: 14,
        idClub: 9, // Rockstore
        name: "Soirée Étudiante",
        date: dansXJours(13),
        heure: "22h00",
        price: "12€",
        description: "Soirée spécial étudiants avec tarif réduit, ambiance généraliste garantie.",
        poster: "/FRONT_END/img/rockstore/rockstore.webp",
    },
];