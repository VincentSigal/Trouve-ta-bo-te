// ============================================================
//  MIGRATION : data_cards.js + data_users.js → base de données MySQL
//  À exécuter une seule fois avec : node migrate.js
// ============================================================

const mysql = require("mysql2/promise");

// ── TON USER (copié depuis data_users.js) ──
const users = [
    {
        email: "user.demo@trouvetaboite.fr",
        city: "Montpellier",
        password: "motdepasse",
        newsletter: false,
        role: "owner",
    },
];

// ── TES BOÎTES (copiées depuis data_cards.js, avec sirets factices) ──
const boites = [
  { name: "LA DUNE", background: "/img/la_dune/la_dune.png", location_name: "La Grande-Motte", location_link: "https://maps.app.goo.gl/sHrLCVrAQdApoHeQA", description: "Discothèque élégante et futuriste avec toit-terrasse proposant de la cuisine française moderne et une vue sur la mer.", music: "Open Format", siret: "11111111111111" },
  { name: "L'AMNESIA", background: "/img/amnesia/amnesia.png", location_name: "Cap d'Agde", location_link: "https://maps.app.goo.gl/b3EV2N6SayRqxcwX7", description: "Discothèque populaire ouverte en saison, accueillant régulièrement des DJ internationaux et français.", music: "Pop", siret: "22222222222222" },
  { name: "L'ENTREPÔT", background: "/img/entrepot/lentrepot.png", location_name: "Lattes", location_link: "https://maps.app.goo.gl/oSKwXMHpghmogWfh8", description: "Discothèque animée diffusant du dancehall et du hip-hop dans un espace de type entrepôt, avec danse de salon chaque semaine.", music: "Rap, Shatta, Afro, Buyon", siret: "33333333333333" },
  { name: "LE PULP", background: "/img/le_pulp/le_pulp.png", location_name: "Lattes", location_link: "https://maps.app.goo.gl/hSZdKXxsvk59Nr3E9", description: "Club avec espaces bar, piste de danse, patio orné de palmiers et d'une statue de Bouddha et soirées à thème.", music: "Pop", siret: "44444444444444" },
  { name: "BORA CLUB", background: "/img/bora/bora.jpg", location_name: "Cap d'Agde", location_link: "https://maps.app.goo.gl/ceTV4d2RfxnSEnnm7", description: "Ce club ouvert en saison, qui propose des soirées DJ, comprend un jardin, un lounge privé et plusieurs bars.", music: "Rap, Shatta, Afro, Buyon", siret: "55555555555555" },
  { name: "CLUB CASITA", background: "/img/casita/casita.jpg", location_name: "Saint-Jean-de-Védas", location_link: "https://maps.app.goo.gl/PwA4d2hXyMJSQyjw9", description: "Cette boîte de nuit organise des soirées variées, au son du hip-hop, de l'électro, du rock et de la house.", music: "Open Format", siret: "66666666666666" },
  { name: "L'OSMOSE", background: "/img/osmose/osmose.jpg", location_name: "Lattes", location_link: "https://maps.app.goo.gl/KREdMoGisBVwRH1Q8", description: "Discothèque lounge avec plusieurs salles, proposant de la musique généraliste.", music: "Pop", siret: "77777777777777" },
  { name: "Dieze Warehouse", background: "/img/dieze/dieze.jpg", location_name: "Montpellier", location_link: "https://maps.app.goo.gl/Fzci1sVkdAtK36LE7", description: "Ancien entrepôt reconverti en lieu événementiel accueillant les plus grands noms de la scène techno.", music: "Techno", siret: "88888888888888" },
  { name: "Rockstore", background: "/img/rockstore/rockstore.webp", location_name: "Montpellier", location_link: "https://maps.app.goo.gl/tZh4MQr22SUJeBda8", description: "Salle mythique de Montpellier alternant concerts, boîte de nuit et événements musicaux variés.", music: "Open Format", siret: "99999999999999" },
  { name: "Must Club", background: "/img/must_club/must_club.webp", location_name: "Vias-Plage", location_link: "https://maps.app.goo.gl/ykNjzxP67TgqtZwY7", description: "Club récent de la côte héraultaise proposant des soirées généralistes et événements saisonniers.", music: "Open Format", siret: "10101010101010" },
  { name: "Le Milk Famous Club", background: "/img/milk/milk.webp", location_name: "Saint-Jean-de-Védas", location_link: "https://maps.app.goo.gl/vwFukTkRAFoiUYScA", description: "Club moderne aux portes de Montpellier accueillant régulièrement des DJ et soirées thématiques.", music: "Open Format", siret: "12121212121212" },
  { name: "Mélomane Club", background: "/img/melomane/melomane.webp", location_name: "Montpellier", location_link: "https://maps.app.goo.gl/pygW8CxzqRC2uWKT6", description: "Le Mélomane Club, est une adresse incontournable pour les amateurs de rave, techno et hard music.", music: "Techno", siret: "13131313131313" },
  { name: "Le Panama Club", background: "/img/panama/panama.webp", location_name: "Montpellier", location_link: "https://maps.app.goo.gl/PQ2McqpiGXJArj1z9", description: "Discothèque du centre historique proposant des soirées commerciales et étudiantes avec un étage dédié à la musique latine.", music: "Pop", siret: "14141414141414" },
  { name: "Le Fizz", background: "/img/fizz/fizz.webp", location_name: "Montpellier", location_link: "https://maps.app.goo.gl/emR1MjEZsqnGWnNQ6", description: "Club populaire du centre-ville connu pour ses soirées étudiantes et son ambiance généraliste.", music: "Pop", siret: "15151515151515" },
  { name: "Le Club", background: "/img/club/club.webp", location_name: "Montpellier", location_link: "https://maps.app.goo.gl/BAGPQSRgA9JWuzdV6", description: "Cocktails et sets de DJ dans une petite discothèque animée ouverte tard dans la nuit et prisée des étudiants locaux.", music: "Rap, Shatta, Afro, Buyon", siret: "16161616161616" },
  { name: "Le Club Cabaret Oriental", background: "/img/club_oriental/club_oriental.webp", location_name: "Lattes", location_link: "https://maps.app.goo.gl/LvzUz82G7LQRSKTE6", description: "Établissement mêlant ambiance orientale et spectacles.", music: "Open Format", siret: "17171717171717" },
  { name: "L'EG Club", background: "/img/eg/eg.webp", location_name: "Marseillan-Plage", location_link: "https://maps.app.goo.gl/ogZLhDpRghaFYrJx7", description: "Discothèque estivale proche du front de mer avec un patio ouvert.", music: "Pop", siret: "18181818181818" },
  { name: "L'Usine à Gaz", background: "/img/lusine_a_gaz/lusine_a_gaz.webp", location_name: "Béziers", location_link: "https://maps.app.goo.gl/JCCNhSbp2e8r1qGi7", description: "Installée dans un usine de 1901, cette boîte de nuit propose des concerts et de la musique diversifiée.", music: "Open Format", siret: "19191919191919" },
  { name: "Discothèque Le 2", background: "/img/le_2/le_2.webp", location_name: "Béziers", location_link: "https://maps.app.goo.gl/dUcxxFo87KNa37wP8", description: "Discothèque du centre de Béziers proposant des soirées latino et festives.", music: "Open Format", siret: "20202020202020" },
];

async function migrate() {
    const db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "trouve_ta_boite" // ← adapte si le nom de ta base est différent
    });

    console.log("Connecté à la base de données.");

    try {
        // 1. Insérer le user owner et récupérer son idUser généré par MySQL
        let idUserOwner;

        for (const user of users) {
            const [result] = await db.query(
                "INSERT INTO users (email, city, password, newsletter, role) VALUES (?, ?, ?, ?, ?)",
                [user.email, user.city, user.password, user.newsletter, user.role]
            );

            if (user.role === "owner") {
                idUserOwner = result.insertId;
            }

            console.log(`✔ User inséré : ${user.email} (idUser = ${result.insertId})`);
        }

        if (!idUserOwner) {
            throw new Error("Aucun user avec le rôle 'owner' trouvé dans le tableau users.");
        }

        // 2. Insérer chaque boîte
        for (const boite of boites) {

            // a. Récupérer ou créer la ville
            const [existingCity] = await db.query(
                "SELECT idCity FROM location WHERE location_name = ?",
                [boite.location_name]
            );

            let idCity;
            if (existingCity.length > 0) {
                idCity = existingCity[0].idCity;
            } else {
                const [cityResult] = await db.query(
                    "INSERT INTO location (location_name) VALUES (?)",
                    [boite.location_name]
                );
                idCity = cityResult.insertId;
            }

            // b. Récupérer ou créer le style musical
            const [existingMusic] = await db.query(
                "SELECT idMusic FROM music WHERE music = ?",
                [boite.music]
            );

            let idMusic;
            if (existingMusic.length > 0) {
                idMusic = existingMusic[0].idMusic;
            } else {
                const [musicResult] = await db.query(
                    "INSERT INTO music (music) VALUES (?)",
                    [boite.music]
                );
                idMusic = musicResult.insertId;
            }

            // c. Insérer la boîte
            const [boiteResult] = await db.query(
                `INSERT INTO boites (background, name, location_link, description, siret, idUser, idCity)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [boite.background, boite.name, boite.location_link, boite.description, boite.siret, idUserOwner, idCity]
            );

            const idClub = boiteResult.insertId;

            // d. Relier au style musical
            await db.query(
                "INSERT INTO a_pour_style (idMusic, idClub) VALUES (?, ?)",
                [idMusic, idClub]
            );

            console.log(`✔ Boîte insérée : ${boite.name} (idClub = ${idClub})`);
        }

        console.log("\n✅ Migration terminée avec succès !");

    } catch (err) {
        console.error("❌ Erreur pendant la migration :", err);
    } finally {
        await db.end();
    }
}

migrate();
