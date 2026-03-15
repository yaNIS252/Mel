/* =========================================
   1. DONNÉES DE L'HISTOIRE
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
        progres: 10,
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
        choix: [{ texte: "On enchaine ?", destination: 7 }]
    },
    6: {
        texte: "Euh... tu n'as rien trouvé c tropp gros ca prendrai trop de temps de chercher dans tous ça, on retourne au salon ?",
        image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=500",
        progres: 10,
        choix: [{ texte: "Retourner au salon", destination: 1 }]
    },
    7: {
        texte: "Bon on commence a parler ou a jouer ?",
        image: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=500",
        progres: 60,
        choix: [
            { texte: "JOUERR", destination: 8 },
            { texte: "Papoter et commencer vraiment l'histoire", destination: 9 }
        ] 
    },
    8: {
        texte: "Attention ! Des cœurs sauvages t'attaquent. Tranches-en 10 pour passer !",
        image: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=500",
        type: "minijeu_action",
        progres: 60,
        choix: [
            { texte: "Sortir le sabre ninja", action: "lancerHeartNinja" }
        ],
        destinationSuccess: 7 
    },
    9: {
        texte: "L'histoire commence ici...",
        image: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=500",
        progres: 60,
        choix: [] 
    }
};

/* =========================================
   2. ÉTAT DU JEU
   ========================================= */
let inventaire = [];
let etapeActuelle = 1;

/* =========================================
   3. INITIALISATION
   ========================================= */
window.onload = () => {
    const saveInv = localStorage.getItem('sauvegardeInventaire');
    if (saveInv) {
        inventaire = JSON.parse(saveInv);
        mettreAJourInventaireUI();
    }

    const saveEtape = localStorage.getItem('sauvegardeEtape');
    if (saveEtape) {
        etapeActuelle = parseInt(saveEtape);
        chargerEtape(etapeActuelle);
    } else {
        etapeActuelle = 1;
        chargerEtape(1);
    }
    
    if (localStorage.getItem('jeuDemarre') === 'true') {
        document.getElementById('welcome-screen').classList.add('welcome-hidden');
    }
};

function demarrerJeu() {
    localStorage.setItem('jeuDemarre', 'true');
    document.getElementById('welcome-screen').classList.add('welcome-hidden');
    chargerEtape(1);
}

/* =========================================
   4. MOTEUR DE JEU (LA CORRECTION EST ICI)
   ========================================= */
function chargerEtape(id) {
    const etape = aventure[id];
    if (!etape) return;
    etapeActuelle = id;

    const card = document.getElementById('content-card');
    card.classList.add('fade-hidden');

    setTimeout(() => {
        document.getElementById('story-text').innerText = etape.texte;
        
        // Sécurité pour l'image : on s'assure que l'élément img existe
        const imgEl = document.getElementById('scene-image');
        if (imgEl) {
            imgEl.src = etape.image;
            imgEl.style.display = "block"; // On la réaffiche si un jeu l'avait cachée
        }

        document.getElementById('progress-bar').style.width = etape.progres + "%";

        if (etape.item) {
            ajouterAuSac(etape.item, etape.itemImg || "https://via.placeholder.com/100"); 
        }

        // Zone du code numérique
        const miniZone = document.getElementById('minigame-container');
        if (etape.type === "minijeu") {
            miniZone.classList.remove('hidden-element');
        } else {
            miniZone.classList.add('hidden-element');
        }

        // GÉNÉRATION DES CHOIX (CORRIGÉ)
        const container = document.getElementById('choices-container');
        container.innerHTML = "";
        etape.choix.forEach(c => {
            const btn = document.createElement('button');
            btn.innerText = c.texte;
            btn.onclick = () => {
                // Si le choix a une ACTION, on lance la fonction correspondante
                if (c.action === "lancerHeartNinja") {
                    lancerHeartNinja();
                } else if (c.destination) {
                    chargerEtape(c.destination);
                }
            };
            container.appendChild(btn);
        });

        card.classList.remove('fade-hidden');
        localStorage.setItem('sauvegardeEtape', id);
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
   5. MINI-JEU : HEART NINJA
   ========================================= */
function lancerHeartNinja() {
    const wrapper = document.getElementById('image-wrapper');
    const destination = aventure[etapeActuelle].destinationSuccess;

    // On cache l'image de base pour mettre le jeu
    wrapper.innerHTML = `
        <div id="ninja-container" style="position:relative; width:100%; height:300px; background:#1a1a1a; overflow:hidden; touch-action:none; border-radius:15px;">
            <canvas id="ninjaCanvas" width="400" height="300" style="width:100%; height:100%; cursor:crosshair;"></canvas>
            <div id="ninja-score" style="position:absolute; top:10px; left:10px; color:white; font-family:sans-serif; background:rgba(0,0,0,0.5); padding:5px; border-radius:5px;">Cœurs tranchés: 0 / 10</div>
        </div>`;

    const canvas = document.getElementById('ninjaCanvas');
    const ctx = canvas.getContext('2d');
    let score = 0;
    let hearts = [];
    let isDrawing = false;
    let lastX = 0, lastY = 0;

    function spawnHeart() {
        if(score >= 10) return;
        hearts.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: canvas.height + 20,
            speedY: -(Math.random() * 4 + 6),
            speedX: (Math.random() - 0.5) * 3,
            size: 20,
            sliced: false
        });
    }

    function checkSlice(x, y) {
        hearts.forEach(h => {
            if (!h.sliced) {
                let dist = Math.hypot(h.x - x, h.y - y);
                if (dist < 30) {
                    h.sliced = true;
                    score++;
                    document.getElementById('ninja-score').innerText = `Cœurs tranchés: ${score} / 10`;
                    if (score >= 10) setTimeout(win, 500);
                }
            }
        });
    }

    function win() {
        stopGame();
        alert("Quelle dextérité ! Tu as tranché assez de cœurs ❤️");
        // On remet l'image de base avant de changer d'étape
        wrapper.innerHTML = `<img id="scene-image" src="" alt="Scène">`;
        chargerEtape(destination);
    }

    function stopGame() {
        clearInterval(spawnInterval);
        gameActive = false;
    }

    let gameActive = true;
    function update() {
        if(!gameActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        hearts.forEach((h, index) => {
            h.x += h.speedX;
            h.y += h.speedY;
            h.speedY += 0.12;

            ctx.font = h.sliced ? "20px serif" : "30px serif";
            ctx.fillText(h.sliced ? "💔" : "❤️", h.x - 15, h.y);

            if (h.y > canvas.height + 50) hearts.splice(index, 1);
        });
        requestAnimationFrame(update);
    }

    const handleMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        checkSlice(x, y);
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove);

    update();
    let spawnInterval = setInterval(spawnHeart, 900);
}

/* =========================================
   6. INVENTAIRE & MENU
   ========================================= */
function ajouterAuSac(nom, imagePath, type = "image", mediaUrl = "") {
    if (!inventaire.some(item => item.nom === nom)) {
        inventaire.push({ nom, img: imagePath, type, url: mediaUrl || imagePath });
        mettreAJourInventaireUI();
        localStorage.setItem('sauvegardeInventaire', JSON.stringify(inventaire));
    }
}

function mettreAJourInventaireUI() {
    const grid = document.getElementById('inventory-grid');
    if(!grid) return;
    grid.innerHTML = inventaire.map((item, index) => `
        <div class="inventory-item">
            <img src="${item.img}" alt="${item.nom}">
            <p>${item.nom}</p>
            <button onclick="ouvrirMedia(${index})">👁️ Voir</button>
        </div>`).join("");
}

function ouvrirMedia(index) {
    const item = inventaire[index];
    const display = document.getElementById('viewer-display');
    document.getElementById('viewer-title').innerText = item.nom;
    
    display.innerHTML = item.type === "video" 
        ? `<video controls playsinline autoplay><source src="${item.url}" type="video/mp4"></video>`
        : `<img src="${item.url}">`;
    
    document.getElementById('media-viewer').classList.remove('hidden-element');
}

function fermerMedia() {
    document.getElementById('media-viewer').classList.add('hidden-element');
    document.getElementById('viewer-display').innerHTML = "";
}

function toggleMenu() { document.getElementById('side-menu').classList.toggle('side-menu-open'); }
function toggleInventory() { document.getElementById('inventory-screen').classList.toggle('hidden-element'); }
function resetGame() { localStorage.clear(); location.reload(); }