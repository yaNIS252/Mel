// 1. Les Données (L'histoire)
const aventure = {
    1: {
        texte: "Bienvenue mon cœur ! Aujourd'hui, c'est toi l'héroïne. Tu trouves une mystérieuse boîte sur la table. Elle est verrouillée.",
        image: "https://images.unsplash.com/photo-1549465220-1d8c9d9c6703?w=500",
        progres: 10,
        choix: [
            { texte: "Chercher la clé dans le salon", destination: 2 },
            { texte: "Essayer de forcer la boîte", destination: 3 }
        ]
    },
    2: {
        texte: "Bravo ! En fouillant sous le canapé, tu trouves une petite clé dorée.",
        image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500",
        item: "Clé Dorée",
        progres: 30,
        choix: [
            { texte: "Retourner à la boîte", destination: 4 }
        ]
    },
    3: {
        texte: "C'est peine perdue, elle est trop solide. Tu devrais chercher la clé.",
        image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=500",
        progres: 15,
        choix: [
            { texte: "Chercher dans le salon", destination: 2 }
        ]
    },
    4: {
        texte: "La clé tourne dans la serrure... CLIC ! À l'intérieur, un clavier numérique s'allume. Il faut un code (Indice : Notre mois et jour de rencontre).",
        image: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=500",
        type: "minijeu",
        codeAttendu: "2204", // Exemple : 12 mai
        destinationSuccess: 5,
        progres: 60,
        choix: [] // Pas de choix, le mini-jeu bloque la progression
    },
    5: {
        texte: "LE CODE EST BON ! La boîte s'ouvre sur ton cadeau final... Je t'aime !",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500",
        progres: 100,
        choix: [{ texte: "Recommencer", destination: 1 }]
    }
};

// 2. L'État du jeu
let inventaire = [];
let etapeActuelle = 1;

// 3. Le Moteur
function chargerEtape(id) {
    const etape = aventure[id];
    const card = document.getElementById('content-card');
    
    // Animation de sortie
    card.classList.add('fade-hidden');

    setTimeout(() => {
        // Mise à jour du contenu
        document.getElementById('story-text').innerText = etape.texte;
        document.getElementById('scene-image').src = etape.image;
        document.getElementById('progress-bar').style.width = etape.progres + "%";

        // Gestion de l'item
        if (etape.item && !inventaire.includes(etape.item)) {
            inventaire.push(etape.item);
            document.getElementById('inventory-list').innerText = inventaire.join(", ");
        }

        // Gestion du mini-jeu
        const minigameZone = document.getElementById('minigame-container');
        if (etape.type === "minijeu") {
            minigameZone.classList.remove('hidden-element');
        } else {
            minigameZone.classList.add('hidden-element');
        }

        // Génération des choix
        const container = document.getElementById('choices-container');
        container.innerHTML = "";
        etape.choix.forEach(c => {
            const btn = document.createElement('button');
            btn.innerText = c.texte;
            btn.onclick = () => {
                etapeActuelle = c.destination;
                chargerEtape(c.destination);
            };
            container.appendChild(btn);
        });

        // Animation d'entrée
        card.classList.remove('fade-hidden');
    }, 400);
}

function verifierCode() {
    const input = document.getElementById('code-input').value;
    const etape = aventure[etapeActuelle];
    
    if (input === etape.codeAttendu) {
        document.getElementById('code-input').value = "";
        chargerEtape(etape.destinationSuccess);
    } else {
        alert("Mauvais code ! Réessaie...");
    }
}

// Lancement
chargerEtape(1);