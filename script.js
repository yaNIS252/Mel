/* =========================================
   1. DONNÉES DE L'HISTOIRE (L'OBJET AVENTURE)
   ========================================= */
const aventure = {
    1: {
        texte: "Bref il y a une mystérieuse boîte sur la table. Elle est verrouillée. Comment faireeee ?",
        image: "https://images.unsplash.com/photo-1549465220-1d8c9d9c6703?w=500",
        progres: 10,
        choix: [
            { texte: "Chercher la clé dans le salon", destination: 2 },
            { texte: "Essayer de forcer la boîte", destination: 3 },
            { texte: "Chercher dans tes fesses", destination: 6 }
        ]
    },
    2: {
        texte: "Bravo ! En fouillant sous le canapé, tu trouves une petite clé dorée.",
        image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500",
        item: "Clé Dorée",
        itemImg: "https://cdn-icons-png.flaticon.com/512/6947/6947477.png",
        progres: 30,
        choix: [{ texte: "Retourner à la boîte", destination: 4 }]
    },
    3: {
        texte: "C'est peine perdue, elle est trop solide. Tu devrais chercher la clé.",
        image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=500",
        progres: 15,
        choix: [{ texte: "Chercher dans le salon", destination: 2 }]
    },
    4: {
        texte: "La clé tourne dans la serrure... CLIC ! À l'intérieur, un clavier numérique s'allume.\n\nIndice : Ma date de naissance (Ex: 01012001).",
        image: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=500",
        type: "minijeu",
        codeAttendu: "25022006", 
        destinationSuccess: 5,
        progres: 60,
        choix: [] 
    },
    5: {
        texte: "LE CODE EST BON ! La boîte s'ouvre sur ton cadeau final... Je t'aime ! \n\nBon c'était simple pour te mettre en jambe, je vais rallonger tout ça !",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500",
        progres: 100,
        choix: [{ texte: "Recommencer au début", destination: 1 }]
    },
    6: {
        texte: "Euh... tu n'as rien trouvé à part un moment de solitude. On retourne au salon ?",
        image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=500",
        progres: 10,
        choix: [{ texte: "Retourner au salon", destination: 1 }]
    }
};

/* =========================================
   2. ÉTAT DU JEU
   ========================================= */
let inventaire = [];
let etapeActuelle = 1;

/* =========================================
   3. NAVIGATION ET ÉCRANS
   ========================================= */

function demarrerJeu() {
    document.getElementById('welcome-screen').classList.add('welcome-hidden');
    chargerEtape(1);
}

function toggleMenu() {
    document.getElementById('side-menu').classList.toggle('side-menu-open');
}

function retourAccueil() {
    document.getElementById('welcome-screen').classList.remove('welcome-hidden');
    document.getElementById('side-menu').classList.remove('side-menu-open');
}

function allerAuChapitre(id) {
    if (aventure[id]) {
        chargerEtape(id);
        document.getElementById('side-menu').classList.remove('side-menu-open');
        document.getElementById('welcome-screen').classList.add('welcome-hidden');
    }
}

/* =========================================
   4. SYSTÈME D'INVENTAIRE (SAC À DOS)
   ========================================= */

function toggleInventory() {
    document.getElementById('inventory-screen').classList.toggle('hidden-element');
}

function ajouterAuSac(nom, imagePath) {
    if (!inventaire.some(item => item.nom === nom)) {
        inventaire.push({ nom: nom, img: imagePath });
        mettreAJourInventaireUI();
    }
}

function mettreAJourInventaireUI() {
    const grid = document.getElementById('inventory-grid');
    const msg = document.getElementById('empty-msg');
    grid.innerHTML = "";
    
    if (inventaire.length > 0) {
        if (msg) msg.style.display = "none";
        inventaire.forEach(item => {
            grid.innerHTML += `
                <div class="inventory-item">
                    <img src="${item.img}" alt="${item.nom}">
                    <p>${item.nom}</p>
                </div>`;
        });
    }
}

/* =========================================
   5. MOTEUR DE JEU
   ========================================= */

function chargerEtape(id) {
    const etape = aventure[id];
    if (!etape) return;
    etapeActuelle = id;

    const card = document.getElementById('content-card');
    card.classList.add('fade-hidden');

    setTimeout(() => {
        // Mise à jour visuelle
        document.getElementById('story-text').innerText = etape.texte;
        document.getElementById('scene-image').src = etape.image;
        document.getElementById('progress-bar').style.width = etape.progres + "%";

        // Objets
        if (etape.item) {
            ajouterAuSac(etape.item, etape.itemImg || "https://via.placeholder.com/100"); 
        }

        // Mini-jeu
        const miniZone = document.getElementById('minigame-container');
        etape.type === "minijeu" ? miniZone.classList.remove('hidden-element') : miniZone.classList.add('hidden-element');

        // Choix
        const container = document.getElementById('choices-container');
        container.innerHTML = "";
        etape.choix.forEach(c => {
            const btn = document.createElement('button');
            btn.innerText = c.texte;
            btn.onclick = () => chargerEtape(c.destination);
            container.appendChild(btn);
        });

        card.classList.remove('fade-hidden');
    }, 400);
}

function verifierCode() {
    const val = document.getElementById('code-input').value;
    const etape = aventure[etapeActuelle];
    if (val === etape.codeAttendu) {
        document.getElementById('code-input').value = "";
        chargerEtape(etape.destinationSuccess);
    } else {
        alert("Mauvais code ! Réessaie mon cœur...");
    }
}

/* =========================================
   6. FERMETURE AU CLIC EXTÉRIEUR
   ========================================= */
window.onclick = function(event) {
    const modal = document.getElementById('inventory-screen');
    if (event.target == modal) modal.classList.add('hidden-element');
};