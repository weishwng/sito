document.addEventListener('DOMContentLoaded', () => {
    // Elementi DOM
    const contenitore = document.getElementById("contenitore-barre");
    const sliderVelocita = document.getElementById("sliderVelocita");
    const btnNuovoArray = document.getElementById("btnNuovoArray");
    const btnOrdina = document.getElementById("btnOrdina");
    const selAlgoritmo = document.getElementById("selAlgoritmo");
    const titoloAlgoritmo = document.getElementById("titoloAlgoritmo");
    const infoAlgoritmo = document.getElementById("infoAlgoritmo");
    const contatoreComparazioni = document.getElementById("contatoreComparazioni");
    const contatoreScambi = document.getElementById("contatoreScambi");

    // Array di barre e variabili globali
    let barre = [];
    let staOrdinando = false;
    const numeroBarre = 100;
    let comparazioni = 0;
    let scambi = 0;

    // Dati algoritmi
    const datiAlgoritmi = {
        bubble: { 
            titolo: "Bubble Sort", 
            info: "Confronta elementi adiacenti e li scambia se sono nell'ordine sbagliato. O(n²)" 
        },
        selection: { 
            titolo: "Selection Sort", 
            info: "Cerca il minimo e lo sposta all'inizio. O(n²)" 
        },
        insertion: { 
            titolo: "Insertion Sort", 
            info: "Inserisce ogni elemento nella posizione corretta. O(n²)" 
        },
        quick: { 
            titolo: "Quick Sort", 
            info: "Divida l'array con un pivot e ordina ricorsivamente. Media O(n log n)" 
        }
    };

    // Funzioni di supporto

    // Pausa esecuzione
    function aspetta(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Ritardo in base allo slider di velocità
    function ottieniRitardo() {
        return 200 - (sliderVelocita.value * 1.8);
    }

    // Resetta contatori
    function azzerapContatori() {
        comparazioni = 0;
        scambi = 0;
        aggiornaContatori();
    }

    // Aggiorna numero sulla pagina
    function aggiornaContatori() {
        contatoreComparazioni.innerText = comparazioni;
        contatoreScambi.innerText = scambi;
    }

    // Crea array casuale
    function creaNuovoArray() {
        if (staOrdinando) return;
        contenitore.innerHTML = '';
        barre = [];
        azzerapContatori();
        
        // Calcolo larghezza barra
        const larghezza = Math.floor(contenitore.clientWidth / numeroBarre) - 2;

        // LOOP: Ripeto questa operazione 100 volte (per ogni barra)
        // \"for (let i = 0; i < 100; i++)\" significa:
        // i = 0, esegui il codice
        // i = 1, esegui il codice
        // i = 2, esegui il codice
        // ... fino a i = 99
        for (let i = 0; i < numeroBarre; i++) {
            // Genero altezza casuale tra 20px e 370px
            const altezza = Math.floor(Math.random() * 350) + 20;
            
            // Creo nuovo elemento div
            const barra = document.createElement("div");
            
            // Assegno classe CSS
            barra.className = "barra";
            
            // Imposto altezza
            barra.style.height = `${altezza}px`;
            
            // Imposto larghezza
            barra.style.width = `${larghezza}px`;
            
            // Aggiungo barra al contenitore
            contenitore.appendChild(barra);
            
            // Aggiungo all'array
            barre.push({ element: barra, height: altezza });
        }
    }

    // Resetta colori barre
    function azzerapColoriBarr() {
        barre.forEach(barra => {
            barra.element.classList.remove("ordinata", "confronto", "pivot");
        });
    }

    // Scambia due barre
    async function scambia(i, j) {
        let temp = barre[i].height;
        barre[i].height = barre[j].height;
        barre[j].height = temp;
        barre[i].element.style.height = `${barre[i].height}px`;
        barre[j].element.style.height = `${barre[j].height}px`;
        scambi++;
        aggiornaContatori();
    }

    // Algoritmi di ordinamento
    async function ordinaBubbleSort() {
        for (let i = 0; i < barre.length; i++) {
            for (let j = 0; j < barre.length - i - 1; j++) {
                barre[j].element.classList.add("confronto");
                barre[j+1].element.classList.add("confronto");
                comparazioni++;
                aggiornaContatori();
                await aspetta(ottieniRitardo());
                if (barre[j].height > barre[j + 1].height) {
                    await scambia(j, j + 1);
                }
                barre[j].element.classList.remove("confronto");
                barre[j+1].element.classList.remove("confronto");
            }
            barre[barre.length - 1 - i].element.classList.add("ordinata");
        }
    }

    // Selection Sort
    async function ordinaSelectionSort() {
        for (let i = 0; i < barre.length; i++) {
            let indiceMinimo = i;
            barre[i].element.classList.add("pivot");
            for (let j = i + 1; j < barre.length; j++) {
                barre[j].element.classList.add("confronto");
                comparazioni++;
                aggiornaContatori();
                await aspetta(ottieniRitardo());
                if (barre[j].height < barre[indiceMinimo].height) {
                    if (indiceMinimo !== i) {
                        barre[indiceMinimo].element.classList.remove("pivot");
                    }
                    indiceMinimo = j;
                    barre[indiceMinimo].element.classList.add("pivot");
                }
                barre[j].element.classList.remove("confronto");
            }
            await scambia(i, indiceMinimo);
            barre[indiceMinimo].element.classList.remove("pivot");
            barre[i].element.classList.add("ordinata");
        }
    }

    // Insertion Sort
    async function ordinaInsertion() {
        for (let i = 0; i < barre.length; i++) {
            let j = i;
            while (j > 0 && barre[j].height < barre[j - 1].height) {
                barre[j].element.classList.add("confronto");
                comparazioni++;
                aggiornaContatori();
                await scambia(j, j - 1);
                await aspetta(ottieniRitardo());
                barre[j].element.classList.remove("confronto");
                j--;
            }
            for (let k = 0; k <= i; k++) {
                barre[k].element.classList.add("ordinata");
            }
        }
    }

    // Quick Sort
    async function ordinaQuick(inizio, fine) {
        if (inizio >= fine) {
            if (inizio >= 0 && inizio < barre.length) {
                barre[inizio].element.classList.add("ordinata");
            }
            return;
        }
        let indicePivot = await partiziona(inizio, fine);
        await ordinaQuick(inizio, indicePivot - 1);
        await ordinaQuick(indicePivot + 1, fine);
    }

    // Partiziona per Quick Sort
    async function partiziona(inizio, fine) {
        let valPivot = barre[fine].height;
        barre[fine].element.classList.add("pivot");
        let pIndice = inizio;
        for (let i = inizio; i < fine; i++) {
            barre[i].element.classList.add("confronto");
            comparazioni++;
            aggiornaContatori();
            await aspetta(ottieniRitardo());
            if (barre[i].height < valPivot) {
                await scambia(i, pIndice);
                pIndice++;
            }
            barre[i].element.classList.remove("confronto");
        }
        await scambia(pIndice, fine);
        barre[fine].element.classList.remove("pivot");
        barre[pIndice].element.classList.add("ordinata");
        return pIndice;
    }

    // Event listeners
    btnNuovoArray.addEventListener("click", creaNuovoArray);

    selAlgoritmo.addEventListener("change", (e) => {
        if (staOrdinando) return;
        const val = e.target.value;
        titoloAlgoritmo.innerText = datiAlgoritmi[val].titolo;
        infoAlgoritmo.innerText = datiAlgoritmi[val].info;
        azzerapColoriBarr();
    });

    sliderVelocita.addEventListener("input", () => {
        const percentuale = (sliderVelocita.value / 100) * 100;
        sliderVelocita.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentuale}%, #334155 ${percentuale}%, #334155 100%)`;
    });

    // Bottone Ordina
    btnOrdina.addEventListener("click", async () => {
        if (staOrdinando) return;
        staOrdinando = true;
        btnNuovoArray.disabled = true;
        btnOrdina.disabled = true;
        selAlgoritmo.disabled = true;
        azzerapContatori();
        azzerapColoriBarr();

        const algo = selAlgoritmo.value;
        if (algo === 'bubble') {
            await ordinaBubbleSort();
        } else if (algo === 'selection') {
            await ordinaSelectionSort();
        } else if (algo === 'insertion') {
            await ordinaInsertion();
        } else if (algo === 'quick') {
            await ordinaQuick(0, barre.length - 1);
        }

        barre.forEach(b => {
            b.element.classList.add("ordinata");
        });
        staOrdinando = false;
        btnNuovoArray.disabled = false;
        btnOrdina.disabled = false;
        selAlgoritmo.disabled = false;
    });

    // Inizializzazione
    creaNuovoArray();
    sliderVelocita.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 60%, #334155 60%, #334155 100%)`;
});
