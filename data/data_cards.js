/* ARRAY CARDS BOITES DE NUIT */

export let boites = [
    {
        background: "/img/la_dune/la_dune.png",
        name: "LA DUNE",
        location: {
            location_link: "https://maps.app.goo.gl/sHrLCVrAQdApoHeQA",
            location_name: "La Grande-Motte",
        },
        tags: ["Club n°2 France", "Open Format"],
        description: "Discothèque élégante et futuriste avec toit-terrasse proposant de la cuisine française moderne et une vue sur la mer.",
        details: "/HTML/Details_boite.html",
    },
    {
        background: "/img/amnesia/amnesia.png",
        name: "L'AMNESIA",
        location: {
            location_link: "https://maps.app.goo.gl/b3EV2N6SayRqxcwX7",
            location_name: "Cap d'Agde",
        },
        tags: ["Club n°1 France", "Pop"],
        description: "Discothèque populaire ouverte en saison, accueillant régulièrement des DJ internationaux et français.",
        details: "/HTML/Details_boite.html",
    },
    {
        background: "/img/entrepot/lentrepot.png",
        name: "L'ENTREPÔT",
        location: {
            location_link: "https://maps.app.goo.gl/oSKwXMHpghmogWfh8",
            location_name: "Lattes",
        },
        tags: ["Urban", "Showcase"],
        description: "Discothèque animée diffusant du dancehall et du hip-hop dans un espace de type entrepôt, avec danse de salon chaque semaine.",
        details: "/HTML/Details_boite.html",
    },
    {
        background: "/img/le_pulp/le_pulp.png",
        name: "LE PULP",
        location: {
            location_link: "https://maps.app.goo.gl/hSZdKXxsvk59Nr3E9",
            location_name: "Lattes",
        },
        tags: ["Généraliste", "Chill"],
        description: "Club avec espaces bar, piste de danse, patio orné de palmiers et d'une statue de Bouddha et soirées à thème.",
        details: "/HTML/Details_boite.html",
    },
    {
        background: "/img/bora/bora.jpg",
        name: "BORA CLUB",
        location: {
            location_link: "https://maps.app.goo.gl/ceTV4d2RfxnSEnnm7",
            location_name: "Cap d'Agde",
        },
        tags: ["Rap", "Showcase"],
        description: "Ce club ouvert en saison, qui propose des soirées DJ, comprend un jardin, un lounge privé et plusieurs bars.",
        details: "/HTML/Details_boite.html",
    },
    {
        background: "/img/casita/casita.jpg",
        name: "CLUB CASITA",
        location: {
            location_link: "https://maps.app.goo.gl/PwA4d2hXyMJSQyjw9",
            location_name: "Saint-Jean-de-Védas",
        },
        tags: ["Hip-hop", "House"],
        description: "Cette boîte de nuit organise des soirées variées, au son du hip-hop, de l’électro, du rock et de la house.",
        details: "/HTML/Details_boite.html",
    },
    {
        background: "/img/osmose/osmose.jpg",
        name: "L'OSMOSE",
        location: {
            location_link: "https://maps.app.goo.gl/KREdMoGisBVwRH1Q8",
            location_name: "Lattes",
        },
        tags: ["Généraliste", "Lounge"],
        description: "Discothèque lounge avec plusieurs salles, proposant de la musique généraliste.",
        details: "/HTML/Details_boite.html",
    },
];

/* 
  {
    name: "Dieze Warehouse",
    location: "Montpellier",
    tags: ["Techno", "Warehouse"],
    description: "Ancien entrepôt reconverti en lieu événementiel accueillant les plus grands noms de la scène techno."
  },
  {
    name: "Rockstore",
    location: "Montpellier",
    tags: ["Concerts", "Clubbing"],
    description: "Salle mythique de Montpellier alternant concerts, soirées dansantes et événements musicaux variés."
  },
  {
    name: "Milk Club",
    location: "Montpellier",
    tags: ["Électro", "House"],
    description: "Club moderne proposant une programmation électronique variée dans une ambiance intimiste."
  },
  {
    name: "Must Club",
    location: "Vias",
    tags: ["Open Format", "Ambiance Festive"],
    description: "Club récent de la côte héraultaise proposant des soirées généralistes et événements saisonniers."
  },
  {
    name: "Le Milk Famous Club",
    location: "Saint-Jean-de-Védas",
    tags: ["House", "Électro"],
    description: "Club moderne aux portes de Montpellier accueillant régulièrement des DJ et soirées thématiques."
  },
  {
    name: "Mélomane Club",
    location: "Montpellier",
    tags: ["Techno", "House"],
    description: "Lieu apprécié des amateurs de musique électronique avec une programmation orientée club culture."
  },
  {
    name: "Le Panama Club",
    location: "Montpellier",
    tags: ["Open Format", "Centre-ville"],
    description: "Discothèque du centre historique proposant des soirées commerciales et étudiantes."
  },
  {
    name: "Le Fizz",
    location: "Montpellier",
    tags: ["Étudiant", "Commercial"],
    description: "Club populaire du centre-ville connu pour ses soirées étudiantes et son ambiance généraliste."
  },
  {
    name: "Le Club",
    location: "Montpellier",
    tags: ["After", "Centre-ville"],
    description: "Établissement nocturne situé au cœur de Montpellier proposant des soirées jusqu'au matin."
  },
  {
    name: "Le Club Cabaret Oriental",
    location: "Lattes",
    tags: ["Oriental", "Cabaret"],
    description: "Établissement mêlant ambiance orientale, spectacles et soirées dansantes."
  },
  {
    name: "Les Coulisses",
    location: "La Grande-Motte",
    tags: ["Lounge", "Open Format"],
    description: "Club festif de La Grande-Motte proposant une programmation variée durant la saison."
  },
  {
    name: "L'EG Club",
    location: "Marseillan-Plage",
    tags: ["Summer Club", "Commercial"],
    description: "Discothèque estivale proche du front de mer attirant une clientèle touristique."
  },
  {
    name: "L'Usine à Gaz",
    location: "Béziers",
    tags: ["Techno", "Électro"],
    description: "Club biterrois accueillant régulièrement des soirées électroniques et événements musicaux."
  },
  {
    name: "Discothèque Le 2",
    location: "Béziers",
    tags: ["Commercial", "Open Format"],
    description: "Discothèque du centre de Béziers proposant des soirées généralistes et festives."
  },
 */