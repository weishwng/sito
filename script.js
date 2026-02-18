//Esegui quando la finestra ha finito di caricare tutte le risorse
window.addEventListener('load', () => {
    //Seleziona gli elementi dal dom con querySelector
    const contenitore = document.querySelector("#contenitore-barre");
    const sliderVelocita = document.querySelector("#sliderVelocita");
    const btnNuovoArray = document.querySelector("#btnNuovoArray");
    const btnOrdina = document.querySelector("#btnOrdina");
    const setAlgoritmo = document.querySelector("#selAlgoritmo");
    const titoloAlgoritmo = document.querySelector("#titoloAlgoritmo");
    const infoAlgoritmo = document.querySelector("#infoAlgoritmo");
    const contatoreComparazioni = document.querySelector("#contatoreComparazioni");
    const contatoreScambi = document.querySelector("#contatoreScambi");

    //Variabili globali
    let barre = [];
    let staOrdinando = false;
    const numeroBarre = 100;
    let comparazioni = 0;
    let scambi = 0;

    //Configurazione degli algoritmi
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

    //Crea pausa asincrona
    function aspetta(ms) {
        return new Promise(risolve => setTimeout(risolve, ms));
    }

    //Ricava il ritardo dallo slider
    function ottieniRitardo() {
        //Slider da 1-100 convertito in millisecondi (200 a 20ms)
        return 200 - (sliderVelocita.value * 1.8);
    }

    //Azzera i contatori
    function azzeraContatori() {
        comparazioni = 0;
        scambi = 0;
        aggiornaContatori();
    }

    //Aggiorna i contatori nel DOM
    function aggiornaContatori() {
        contatoreComparazioni.innerText = comparazioni;
        contatoreScambi.innerText = scambi;
    }

    //Crea un nuovo array casuale
    function creaNuovoArray() {
        if (staOrdinando){
            return;
        }
        contenitore.innerHTML = '';
        barre = [];
        azzeraContatori();
        
        //Divide lo spazio disponibile fra numero di barre, meno 2px di margine per barra
        const larghezza = Math.floor(contenitore.clientWidth / numeroBarre) - 2;

        //Genera 100 barre con altezze casuali
        for (let i = 0; i < numeroBarre; i++) {
            //Altezza casuale tra 20px e 370px
            const altezza = Math.floor(Math.random() * 350) + 20;
            const barra = document.createElement("div");
            barra.className = "barra";
            barra.style.height = `${altezza}px`;
            barra.style.width = `${larghezza}px`;
            contenitore.appendChild(barra);
            //Salva riferimento altezza per l'ordinamento
            barre.push({ element: barra, height: altezza });
        }
    }

    //Rimuove le classi colore dalle barre
    function azzeraColoriBarr() {
        barre.forEach(barra => {
            barra.element.classList.remove("ordinata", "confronto", "pivot");
        });
    }

    //Scambia due barre
    async function scambia(i, j) {
        //Scambia le altezze nell'array
        let temp = barre[i].height;
        barre[i].height = barre[j].height;
        barre[j].height = temp;
        //Aggiorna visivamente le altezze
        barre[i].element.style.height = `${barre[i].height}px`;
        barre[j].element.style.height = `${barre[j].height}px`;
        scambi++;
        aggiornaContatori();
    }

    //ALGORITMI DI ORDINAMENTO

    //Bubble Sort: confronta coppie adiacenti
    async function BubbleSort() {
        for (let i = 0; i < barre.length; i++) {
            for (let j = 0; j < barre.length - i - 1; j++) {
                //Colora in rosso gli elementi in confronto
                barre[j].element.classList.add("confronto");
                barre[j+1].element.classList.add("confronto");
                comparazioni++;
                aggiornaContatori();
                await aspetta(ottieniRitardo());
                //Scambia se il primo è maggiore del secondo
                if (barre[j].height > barre[j + 1].height) {
                    await scambia(j, j + 1);
                }
                //Rimuove il colore rosso
                barre[j].element.classList.remove("confronto");
                barre[j+1].element.classList.remove("confronto");
            }
            //Colora in verde gli elementi ordinati (ultimi i)
            barre[barre.length - 1 - i].element.classList.add("ordinata");
        }
    }

    //Selection Sort: trova il minimo e lo sposta
    async function SelectionSort() {
        for (let i = 0; i < barre.length; i++) {
            let indiceMinimo = i;
            //Colora in arancio l'elemento di riferimento
            barre[i].element.classList.add("pivot");
            for (let j = i + 1; j < barre.length; j++) {
                //Colora in rosso gli elementi in confronto
                barre[j].element.classList.add("confronto");
                comparazioni++;
                aggiornaContatori();
                await aspetta(ottieniRitardo());
                //Se trovo un elemento più piccolo, aggiorna il minimo
                if (barre[j].height < barre[indiceMinimo].height) {
                    if (indiceMinimo !== i) {
                        barre[indiceMinimo].element.classList.remove("pivot");
                    }
                    indiceMinimo = j;
                    barre[indiceMinimo].element.classList.add("pivot");
                }
                barre[j].element.classList.remove("confronto");
            }
            //Scambia il minimo trovato con la posizione i
            await scambia(i, indiceMinimo);
            barre[indiceMinimo].element.classList.remove("pivot");
            //Colora in verde l'elemento ordinato
            barre[i].element.classList.add("ordinata");
        }
    }

    //Insertion Sort: inserisce ogni elemento nella posizione corretta
    async function InsertionSort() {
        for (let i = 0; i < barre.length; i++) {
            let j = i;
            //Muove all'indietro finché il valore è più piccolo del precedente
            while (j > 0 && barre[j].height < barre[j - 1].height) {
                barre[j].element.classList.add("confronto");
                comparazioni++;
                aggiornaContatori();
                //Scambia l'elemento con il precedente
                await scambia(j, j - 1);
                await aspetta(ottieniRitardo());
                barre[j].element.classList.remove("confronto");
                j--;
            }
            //Colora in verde tutti gli elementi ordinati fino a i
            for (let k = 0; k <= i; k++) {
                barre[k].element.classList.add("ordinata");
            }
        }
    }

    //Quick Sort: divide con pivot e ordina ricorsivamente
    async function ordinaQuick(inizio, fine) {
        //Caso base: quando l'intervallo ha un solo elemento o meno
        if (inizio >= fine) {
            if (inizio >= 0 && inizio < barre.length) {
                barre[inizio].element.classList.add("ordinata");
            }
            return;
        }
        //Partiziona e ottieni l'indice del pivot
        let indicePivot = await partition(inizio, fine);
        //Ricorsivamente ordina la parte sinistra e destra
        await ordinaQuick(inizio, indicePivot - 1);
        await ordinaQuick(indicePivot + 1, fine);
    }

    //partition l'array intorno al pivot
    async function partition(inizio, fine) {
        //Prende l'ultimo elemento come pivot
        let valPivot = barre[fine].height;
        barre[fine].element.classList.add("pivot");
        //pIndice traccia la posizione dove il pivot andrà
        let pIndice = inizio;
        for (let i = inizio; i < fine; i++) {
            barre[i].element.classList.add("confronto");
            comparazioni++;
            aggiornaContatori();
            await aspetta(ottieniRitardo());
            //Se l'elemento è minore del pivot, muovilo a sinistra
            if (barre[i].height < valPivot) {
                await scambia(i, pIndice);
                pIndice++;
            }
            barre[i].element.classList.remove("confronto");
        }
        //Posiziona il pivot nella sua posizione finale
        await scambia(pIndice, fine);
        barre[fine].element.classList.remove("pivot");
        //Colora il pivot come ordinato
        barre[pIndice].element.classList.add("ordinata");
        return pIndice;
    }

    //EVENT LISTENERS

    //Nuovo Array - genera array casuale
    btnNuovoArray.addEventListener("click", creaNuovoArray);

    //Cambio algoritmo - aggiorna descrizione
    setAlgoritmo.addEventListener("change", (e) => {
        if (staOrdinando) return;
        const val = e.target.value;
        titoloAlgoritmo.innerText = datiAlgoritmi[val].titolo;
        infoAlgoritmo.innerText = datiAlgoritmi[val].info;
        azzeraColoriBarr();
    });

    //Slider velocità - aggiorna colore barra
    sliderVelocita.addEventListener("input", () => {
        //Visualizza il progresso con colore gradiente blu
        const percentuale = (sliderVelocita.value / 100) * 100;
    });

    //Ordina - avvia l'algoritmo selezionato
    btnOrdina.addEventListener("click", async () => {
        //Evita ordinamenti multipli contemporanei
        if (staOrdinando) return;
        staOrdinando = true;
        //Disabilita i pulsanti durante l'ordinamento
        btnNuovoArray.disabled = true;
        btnOrdina.disabled = true;
        setAlgoritmo.disabled = true;
        azzeraContatori();
        azzeraColoriBarr();

        //Esegue l'algoritmo selezionato
        const algo = setAlgoritmo.value;
        if (algo === 'bubble') {
            await BubbleSort();
        } else if (algo === 'selection') {
            await SelectionSort();
        } else if (algo === 'insertion') {
            await InsertionSort();
        } else if (algo === 'quick') {
            await ordinaQuick(0, barre.length - 1);
        }

        //Colora tutto in verde quando finito
        barre.forEach(b => {
            b.element.classList.add("ordinata");
        });
        //Riabilita i pulsanti
        staOrdinando = false;
        btnNuovoArray.disabled = false;
        btnOrdina.disabled = false;
        setAlgoritmo.disabled = false;
    });

    //INIZIALIZZAZIONE
    creaNuovoArray();
});
