//configuarazione progetti
const projects = [
    { 
        id: "L010",
        title: "Calcolo Numero PiGreco", 
        desc: "Un algoritmo in C++/JS per approssimare il valore di Pi Greco utilizzando serie matematiche, gestendo la precisione decimale.", 
        tags: ["Matematica", "Algoritmi"],
        repoLink: "https://github.com/weishengchen/L010_CalcoloNumeroPigreco", // Link aggiornato
        image: null 
    },
    { 
        id: "L007",
        title: "Triangolo Von Koch", 
        desc: "Implementazione ricorsiva per generare il frattale del Triangolo di Von Koch. Dimostrazione grafica della ricorsione.", 
        tags: ["Frattali", "Ricorsione", "Grafica"],
        repoLink: "https://github.com/weishengchen/L007_TriangoloVonKoch",
        image: null 
    },
    { 
        id: "L006/8",
        title: "Binary Tree Structure", 
        desc: "Gestione di un Albero Binario: inserimento nodi, bilanciamento e algoritmi di visita (pre-order, in-order).", 
        tags: ["Strutture Dati", "Puntatori"],
        repoLink: "https://github.com/weishengchen/L008_BinaryTree",
        image: null 
    },
    { 
        id: "L009",
        title: "Successione Numerica", 
        desc: "Analisi e generazione di successioni matematiche complesse tramite cicli iterativi ottimizzati.", 
        tags: ["Logica", "Iterazione"],
        repoLink: "https://github.com/weishengchen/L009_Successione",
        image: null 
    },
    { 
        id: "P001",
        title: "Tic Tac Toe", 
        desc: "Il classico gioco del Tris. Gestione della logica di vittoria, pareggio e turni dei giocatori.", 
        tags: ["Game Dev", "Logica"],
        repoLink: "https://github.com/weishengchen/P001_TicTacToe",
        image: null 
    }
];

// FUNZIONE PER GENERARE LE CARD DEI PROGETTI
const projectsContainer = document.getElementById('projects-list');

projects.forEach(project => {
    // Se c'è un'immagine, usa quella, altrimenti usa un placeholder testuale
    const imageHTML = project.image 
        ? `<img src="${project.image}" alt="${project.title}">` 
        : `<span>${project.id}</span>`;

    // Creiamo i tag HTML
    const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-img">
            ${imageHTML}
        </div>
        <div class="project-info">
            <h3>${project.title}</h3>
            <div class="tags">${tagsHTML}</div>
            <p>${project.desc}</p>
            <a href="${project.repoLink}" target="_blank" class="btn">Vedi Codice su GitHub</a>
        </div>
    `;
    projectsContainer.appendChild(card);
});

//progetto


const visualizerContainer = document.getElementById('visualizer-container');
const startBtn = document.getElementById('btn-start');
let bars = [];
const NUM_BARS = 20;
const DELAY_MS = 60; // Velocità animazione

// Genera barre casuali
function resetBars() {
    visualizerContainer.innerHTML = '';
    bars = [];
    for (let i = 0; i < NUM_BARS; i++) {
        // Altezza random tra 20px e 200px
        let height = Math.floor(Math.random() * 200) + 20;
        
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${height}px`;
        
        visualizerContainer.appendChild(bar);
        bars.push(bar);
    }
    startBtn.disabled = false; // Riabilita il bottone start
}

// Funzione "sleep" per creare il ritardo visivo
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Algoritmo Bubble Sort con animazione
async function startSorting() {
    startBtn.disabled = true; // Disabilita il bottone durante l'ordinamento
    
    for (let i = 0; i < bars.length; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            
            // Colora le barre in confronto (Rosso)
            bars[j].style.backgroundColor = '#f43f5e';
            bars[j+1].style.backgroundColor = '#f43f5e';

            // Pausa per vedere l'effetto
            await sleep(DELAY_MS);

            let h1 = parseInt(bars[j].style.height);
            let h2 = parseInt(bars[j+1].style.height);

            if (h1 > h2) {
                // Scambio altezze
                bars[j].style.height = `${h2}px`;
                bars[j+1].style.height = `${h1}px`;
            }

            // Ripristina colore originale (Azzurro)
            bars[j].style.backgroundColor = '#38bdf8';
            bars[j+1].style.backgroundColor = '#38bdf8';
        }
        // La barra arrivata in fondo è ordinata (Verde)
        bars[bars.length - i - 1].style.backgroundColor = '#10b981';
    }
    // Assicurati che anche la prima barra diventi verde alla fine
    bars[0].style.backgroundColor = '#10b981';
    startBtn.disabled = false;
}

// Inizializza al caricamento
resetBars();