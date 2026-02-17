/* ========================================
   SCRIPT PRINCIPALE - VISUALIZZATORE ALGORITMI
   ========================================
   Questo file contiene:
   - Tutte le funzioni per gestire il visualizzatore di algoritmi
   - Le implementazioni dei 4 algoritmi di ordinamento
   - La gestione degli eventi (click, change, input)
   - Le animazioni e i contatori di comparazioni/scambi
   
   COSA DEVO SPIEGARE AL PROF:
   - Come funzionano gli algoritmi di ordinamento
   - Come si misurano le comparazioni e gli scambi
   - Come uso async/await per l'animazione
   - La complessità temporale di ogni algoritmo
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Script iniziato");
    
    /* ========== ELEMENTI DOM ==========
       Collego gli elementi HTML alle variabili JavaScript
       così posso modificarli durante l'esecuzione */
    const contenitore = document.getElementById("contenitore-barre");
    const sliderVelocita = document.getElementById("sliderVelocita");
    const btnNuovoArray = document.getElementById("btnNuovoArray");
    const btnOrdina = document.getElementById("btnOrdina");
    const selAlgoritmo = document.getElementById("selAlgoritmo");
    const titoloAlgoritmo = document.getElementById("titoloAlgoritmo");
    const infoAlgoritmo = document.getElementById("infoAlgoritmo");
    const contatoreComparazioni = document.getElementById("contatoreComparazioni");
    const contatoreScambi = document.getElementById("contatoreScambi");

    console.log("Elementi DOM caricati:", { contenitore, sliderVelocita, btnNuovoArray, btnOrdina, selAlgoritmo });

    /* ========== VARIABILI GLOBALI ==========
       Queste variabili tengono traccia dello stato dell'applicazione */
    let barre = [];              // Array di oggetti {element: div, height: numero}
    let staOrdinando = false;    // true mentre l'algoritmo sta ordinando
    const numeroBarre = 100;     // Quante barre visualizzo (100 elementi)
    let comparazioni = 0;        // Conta quanti confronti fa l'algoritmo
    let scambi = 0;              // Conta quanti scambi fa l'algoritmo

    /* ========== DATI ALGORITMI ==========
       Per ogni algoritmo conservo il titolo e la descrizione
       così quando l'utente cambia algoritmo aggiorno il testo */
    const datiAlgoritmi = {
        bubble: { 
            titolo: "Bubble Sort", 
            info: "Confronta elementi adiacenti e li scambia se sono nell'ordine sbagliato. Gli elementi più grandi 'affiorano' verso la fine. Complessità: O(n²)" 
        },
        selection: { 
            titolo: "Selection Sort", 
            info: "Cerca ripetutamente l'elemento minimo dalla parte non ordinata e lo sposta all'inizio dell'array. Complessità: O(n²)" 
        },
        insertion: { 
            titolo: "Insertion Sort", 
            info: "Costruisce l'ordinamento inserendo un elemento alla volta nella sua posizione corretta, come si fa con le carte da gioco. Complessità: O(n²)" 
        },
        quick: { 
            titolo: "Quick Sort", 
            info: "Usa un 'pivot' per dividere l'array in due sottogruppi (minori e maggiori) e li ordina ricorsivamente. È il più veloce in media. Complessità media: O(n log n), peggiore: O(n²)" 
        }
    };

    /* ========== FUNZIONI UTILITY ==========
       Funzioni di supporto usate da tutti gli algoritmi */

    /**
     * ASPETTA: Pausa l'esecuzione per ms millisecondi
     * Uso questa per rallentare l'animazione e rendere visibile ogni step
     * 
     * @param {number} ms - Millisecondi da aspettare
     * @returns {Promise} Promise che si risolve dopo ms millisecondi
     */
    function aspetta(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * OTTIENI RITARDO: Calcola il ritardo in base alla velocità dello slider
     * Se lo slider è a 100 (velocità massima), il ritardo è più basso
     * Se lo slider è a 0, il ritardo è circa 200ms (più lento)
     * 
     * Formula: 200 - (valore slider * 1.8)
     * Così il ritardo diminuisce al aumentare della velocità
     * 
     * @returns {number} Ritardo in millisecondi
     */
    function ottieniRitardo() {
        return 200 - (sliderVelocita.value * 1.8);
    }

    /**
     * AZZERA CONTATORI: Resetta a 0 i contatori di comparazioni e scambi
     * Lo chiamo prima di ordinare per iniziare la conta da zero
     */
    function azzerapContatori() {
        comparazioni = 0;
        scambi = 0;
        aggiornaContatori();
    }

    /**
     * AGGIORNA CONTATORI: Aggiorna i numeri visualizzati sulla pagina
     * Chiamo questa funzione ogni volta che avviene una comparazione o uno scambio
     * così l'utente vede in tempo reale quanti confronti e scambi fa l'algoritmo
     */
    function aggiornaContatori() {
        contatoreComparazioni.innerText = comparazioni;
        contatoreScambi.innerText = scambi;
    }

    /**
     * CREA NUOVO ARRAY: Genera 100 barre con altezze casuali da 20 a 370px
     * 
     * STEP:
     * 1. Controlla se già sta ordinando (per evitare conflitti)
     * 2. Pulisce il contenitore cancellando le barre precedenti
     * 3. Calcola la larghezza di ogni barra per riempire lo schermo
     * 4. Crea 100 barre con altezze random
     * 5. Conserva ogni barra in array "barre" per accedervi facilmente
     * 
     * COME FUNZIONA:
     * - Math.random() genera numero da 0 a 1
     * - (Math.random() * 350) genera numero da 0 a 350
     * - "+ 20" aggiunge 20 per avere minimo 20px di altezza
     * - Creo un div per ogni numero e lo aggiungo alla pagina
     */
    function creaNuovoArray() {
        if (staOrdinando) {
            return; // Non creare un nuovo array mentre sto già ordinando
        }
        contenitore.innerHTML = ''; // Cancella tutto dentro il contenitore
        barre = [];                  // Riazzera l'array di barre
        azzerapContatori();          // Resetta i contatori
        const larghezza = Math.floor(contenitore.clientWidth / numeroBarre) - 2;

        for (let i = 0; i < numeroBarre; i++) {
            const altezza = Math.floor(Math.random() * 350) + 20;
            const barra = document.createElement("div");
            barra.className = "barra";
            barra.style.height = `${altezza}px`;
            barra.style.width = `${larghezza}px`;
            contenitore.appendChild(barra);
            barre.push({ element: barra, height: altezza });
        }
    }

    /**
     * AZZERA COLORI BARRE: Rimuove i colori speciali dalle barre
     * Le barre tornano al colore celeste normale
     * 
     * Classi usate:
     * - ordinata: Verde (elemento già al posto giusto)
     * - confronto: Rosso (elemento che sto confrontando)
     * - pivot: Arancio (elemento pivot del Quick Sort)
     */
    function azzerapColoriBarr() {
        barre.forEach(barra => {
            barra.element.classList.remove("ordinata", "confronto", "pivot");
        });
    }

    /**
     * SCAMBIA: Scambia l'altezza di due barre di posizione
     * 
     * COME FUNZIONA (scambio classico con variabile temporanea):
     * 1. Salvo in "temp" l'altezza della prima barra
     * 2. Copio l'altezza della seconda barra nella prima
     * 3. Copio il valore salvato (temp) nella seconda
     * 4. Aggiorno il rendering (style.height) sulla pagina
     * 5. Incremento il contatore degli scambi
     * 
     * Esempio:
     * barre[0].height = 50px, barre[1].height = 100px
     * Dopo lo scambio:
     * barre[0].height = 100px, barre[1].height = 50px
     * 
     * @async - Funzione asincrona (usa await)
     * @param {number} i - Indice della prima barra
     * @param {number} j - Indice della seconda barra
     */
    async function scambia(i, j) {
        let temp = barre[i].height;      // Salvo temporaneamente altezza di barre[i]
        barre[i].height = barre[j].height; // Copio altezza di barre[j] in barre[i]
        barre[j].height = temp;          // Copio il valore salvato in barre[j]
        // Aggiorno i pixel sulla pagina (il width dei div)
        barre[i].element.style.height = `${barre[i].height}px`;
        barre[j].element.style.height = `${barre[j].height}px`;
        scambi++;                        // Incremento il contatore degli scambi
        aggiornaContatori();             // Aggiorno il testo con il nuovo numero
    }

    /* ========== ALGORITMI DI ORDINAMENTO ==========
       Le implementazioni dei 4 algoritmi di ordinamento */

    /**
     * BUBBLE SORT
     * 
     * COME FUNZIONA:
     * - Con cicli annidati: il ciclo esterno = quante "passate"
     * - In ogni passata, il ciclo interno confronta coppie adjacent
     * - Se l'elemento di sinistra > di destra, li scambio
     * - Dopo passata 1, l'elemento più grande è alla fine (come una bolla che sale)
     * - Dopo passata 2, il secondo più grande è al penultimo posto
     * - E così via...
     * 
     * COMPLESSITÀ TEMPORALE: O(n²)
     * - Nel peggio caso: compare ogni elemento con ogni altro (n * n)
     * - Nel migliore caso (array già ordinato): O(n) ma il codice standard è O(n²)
     * 
     * QUANDO LO USO:
     * - Educativamente: per imparare gli algoritmi (è il più semplice)
     * - Array molto piccoli o quasi ordinati
     * - Non lo uso mai in pratica su array grandi
     * 
     * VISUALIZZAZIONE:
     * - Rosso: elementi che sto confrontando
     * - Verde: elementi che si sono già posizionati al fondo
     * 
     * @async
     */
    async function ordinaBubbleSort() {
        // Ciclo esterno: faccio numeroBarre passate
        for (let i = 0; i < barre.length; i++) {
            // Ciclo interno: confronto elementi da sinistra a destra
            // "-i-1" perché le ultime i barre sono già ordinate
            for (let j = 0; j < barre.length - i - 1; j++) {
                // Coloro le due barre in rosso per mostrare che le confronto
                barre[j].element.classList.add("confronto");
                barre[j+1].element.classList.add("confronto");
                comparazioni++; // Incremento il contatore dei confronti
                aggiornaContatori();
                await aspetta(ottieniRitardo()); // Attendo per vedere l'animazione
                
                // Se l'elemento di sinistra è più grande di quello di destra
                if (barre[j].height > barre[j + 1].height) {
                    await scambia(j, j + 1); // Li scambio di posizione
                }
                
                // Rimuovo il colore rosso per prepararmi al prossimo confronto
                barre[j].element.classList.remove("confronto");
                barre[j+1].element.classList.remove("confronto");
            }
            // Coloro di verde l'ultimo elemento perché è nella posizione finale corretta
            barre[barre.length - 1 - i].element.classList.add("ordinata");
        }
    }

    /**
     * SELECTION SORT
     * 
     * COME FUNZIONA:
     * - Divido l'array in due parti: ordinata (destra) e non ordinata (sinistra)
     * - In ogni iterazione: cerco il minimo nella parte non ordinata
     * - Scambio il minimo con il primo elemento non ordinato
     * - Ripeto finché non ho ordinato tutto
     * 
     * COMPLESSITÀ TEMPORALE: O(n²)
     * - Sempre n² confronti, indipendentemente da come è ordinato l'array
     * - È un po' più veloce di Bubble Sort nella pratica (meno scambi)
     * 
     * QUANDO LO USO:
     * - Se voglio un numero fisso e prevedibile di scambi
     * - Quando la memoria è limitata (perché non usa spazio extra)
     * - Array quasi ordinati: comunque O(n²), quindi non è ottimale
     * 
     * VISUALIZZAZIONE:
     * - Arancio (pivot): il minimo che sto cercando
     * - Rosso: elementi che confronto
     * - Verde: elementi già ordinati a sinistra
     * 
     * @async
     */
    async function ordinaSelectionSort() {
        // Ciclo esterno: per ogni posizione dell'array ordinato
        for (let i = 0; i < barre.length; i++) {
            let indiceMinimo = i;  // Inizialmente il minimo è il primo dell'array non ordinato
            barre[i].element.classList.add("pivot"); // Visualmente, indico che sto cercando il minimo
            
            // Ciclo interno: cerco il minimo nel resto dell'array
            for (let j = i + 1; j < barre.length; j++) {
                barre[j].element.classList.add("confronto");
                comparazioni++;
                aggiornaContatori();
                await aspetta(ottieniRitardo());
                
                // Se trovo un elemento più piccolo del minimo finora trovato
                if (barre[j].height < barre[indiceMinimo].height) {
                    // Rimuovo il colore pivot dal vecchio minimo
                    if (indiceMinimo !== i) {
                        barre[indiceMinimo].element.classList.remove("pivot");
                    }
                    indiceMinimo = j; // Il nuovo minimo è in posizione j
                    barre[indiceMinimo].element.classList.add("pivot");
                }
                barre[j].element.classList.remove("confronto");
            }
            
            // Scambio il minimo trovato con la posizione i
            await scambia(i, indiceMinimo);
            barre[indiceMinimo].element.classList.remove("pivot");
            barre[i].element.classList.add("ordinata"); // Marco come ordinato
        }
    }

    /**
     * INSERTION SORT
     * 
     * COME FUNZIONA:
     * - La parte sinistra dell'array è sempre ordinata (inizia con 1 elemento)
     * - Prendo ogni nuovo elemento e lo "inserisco" nella posizione corretta
     * - Sposto gli elementi hacia sinistra finché non trovo il posto giusto
     * - È come ordinare le carte in mano: prendo una carta, la metto nel posto giusto
     * 
     * COMPLESSITÀ TEMPORALE: O(n²)
     * - Nel peggio caso: O(n²)
     * - Nel migliore caso (già ordinato): O(n)
     * - È veloce nei dati quasi ordinati!
     * 
     * QUANDO LO USO:
     * - Array quasi ordinati: è molto più veloce di Bubble Sort
     * - Array piccoli: ha meno overhead di algoritmi più complicati
     * - Ordinamento online: posso inserire nuovi elementi man mano
     * - Stabile: mantiene l'ordine relativo degli elementi uguali
     * 
     * VISUALIZZAZIONE:
     * - Rosso: elemento che sto inserendo
     * - Verde: gli elementi già ordinati a sinistra
     * 
     * @async
     */
    async function ordinaInsertion() {
        // Inizio da 1 (il primo elemento è sempre "ordinato")
        for (let i = 0; i < barre.length; i++) {
            let j = i;
            // Sposto l'elemento i verso sinistra finché non trovo il suo posto
            while (j > 0 && barre[j].height < barre[j - 1].height) {
                barre[j].element.classList.add("confronto"); // Coloro di rosso l'elemento che confronto
                comparazioni++;
                aggiornaContatori();
                await scambia(j, j - 1); // Lo scambio con l'elemento a sinistra
                await aspetta(ottieniRitardo());
                barre[j].element.classList.remove("confronto");
                j--; // Continuo guardando più a sinistra
            }
            
            // Tutti gli elementi da 0 a i sono ora ordinati
            // Li coloro di verde per mostrare la parte ordinata
            for (let k = 0; k <= i; k++) {
                barre[k].element.classList.add("ordinata");
            }
        }
    }

    /**
     * QUICK SORT
     * 
     * COME FUNZIONA (Divide et Impera):
     * - Scelgo un elemento "pivot" (solitamente l'ultimo)
     * - Riorganizzo l'array: elementi < pivot a sinistra, > pivot a destra
     * - Richiamo ricorsivamente sulle due metà
     * - Quando le metà sono di 1 elemento, sono ordinate (casi base)
     * 
     * COMPLESSITÀ TEMPORALE:
     * - Media: O(n log n) - la migliore per array casuali
     * - Peggiore: O(n²) - quando il pivot divide sempre male
     * - Ma in pratica è il più veloce!
     * 
     * QUANDO LO USO:
     * - Array grandi casuale: è il più veloce di questi 4
     * - Database e sistemi reali: usano varianti di Quick Sort
     * - Quando performance sono importanti
     * 
     * RICORSIONE:
     * - Chiamo ordinaQuick sulle due sottoparte ricorsivamente
     * - Caso base: quando start >= end (1 elemento è ordinato)
     * 
     * VISUALIZZAZIONE:
     * - Arancio: il pivot (elemento di divisione)
     * - Rosso: elementi che confronto con il pivot
     * - Verde: elementi già ordinati
     * 
     * @async
     * @param {number} inizio - Indice di inizio della parte da ordinare
     * @param {number} fine - Indice di fine della parte da ordinare
     */
    async function ordinaQuick(inizio, fine) {
        // Caso base: se l'intervallo è 1 elemento o vuoto, è ordinato
        if (inizio >= fine) {
            if (inizio >= 0 && inizio < barre.length) {
                barre[inizio].element.classList.add("ordinata");
            }
            return; // Esco dalla ricorsione
        }
        
        // Partiziono l'array: partiziona ritorna l'indice del pivot finale
        let indicePivot = await partiziona(inizio, fine);
        
        // Richiamo ricorsivamente sulla parte sinistra (minori del pivot)
        await ordinaQuick(inizio, indicePivot - 1);
        
        // Richiamo ricorsivamente sulla parte destra (maggiori del pivot)
        await ordinaQuick(indicePivot + 1, fine);
    }

    /**
     * PARTIZIONA (parte di Quick Sort)
     * 
     * COME FUNZIONA:
     * 1. Scelgo il pivot (l'elemento fino, l'ultimo)
     * 2. Ho un puntatore "pIndice" che parte da inizio
     * 3. Scorro l'array da inizio a fine-1
     * 4. Se un elemento è < pivot, lo scambio con pIndice e incremento pIndice
     * 5. Alla fine, scambio il pivot con pIndice (ora il pivot è nel mezzo)
     * - A sinistra di pIndice: tutti gli elementi < pivot
     * - A destra di pIndice: tutti gli elementi > pivot
     * 
     * ESEMPIO:
     * Array: [5, 2, 8, 1, 9] con pivot = 9 (ultimo elemento)
     * - 5 < 9: scambio con pIndice (era 0, ancora 0) → [5, 2, 8, 1, 9]
     * - 2 < 9: scambio con pIndice (ora 1) → [2, 5, 8, 1, 9]
     * - 8 > 9: non scambio (pIndice rimane 1)
     * - 1 < 9: scambio con pIndice (ora 2) → [2, 1, 5, 8, 9]
     * Risultato: elementi < 9 a sinistra dello scambio finale
     * 
     * @async
     * @param {number} inizio - Inizio della partizione
     * @param {number} fine - Fine della partizione (il pivot)
     * @returns {number} - La posizione finale del pivot
     */
    async function partiziona(inizio, fine) {
        let valPivot = barre[fine].height; // Prendo il valore del pivot (elemento finale)
        barre[fine].element.classList.add("pivot"); // Coloro il pivot di arancio
        let pIndice = inizio; // Inizia il puntatore da inizio
        
        // Scorro tutti gli elementi eccetto il pivot
        for (let i = inizio; i < fine; i++) {
            barre[i].element.classList.add("confronto"); // Coloro di rosso l'elemento che confronto
            comparazioni++;
            aggiornaContatori();
            await aspetta(ottieniRitardo());
            
            // Se l'elemento è minore del pivot
            if (barre[i].height < valPivot) {
                await scambia(i, pIndice); // Lo scambio a sinistra
                pIndice++; // Incremento il puntatore
            }
            barre[i].element.classList.remove("confronto");
        }
        
        // Scambio il pivot nel mezzo (posizione pIndice)
        await scambia(pIndice, fine);
        barre[fine].element.classList.remove("pivot");
        barre[pIndice].element.classList.add("ordinata"); // Marco il pivot come ordinato
        return pIndice; // Ritorno la posizione finale del pivot
    }

    /* ========== GESTIONE DEGLI EVENTI ==========
       Ascolto i click/change/input dell'utente e reago */

    /**
     * EVENTO: Clicko su "NUOVO ARRAY"
     * Genera un nuovo array casuale e reimposta i contatori
     */
    btnNuovoArray.addEventListener("click", creaNuovoArray);

    /**
     * EVENTO: Cambio di algoritmo dal menu a tendina
     * Aggiorna il titolo e la descrizione dell'algoritmo selezionato
     * e rimuove i colori dalla visualizzazione precedente
     */
    selAlgoritmo.addEventListener("change", (e) => {
        console.log("Cambio algoritmo a:", e.target.value);
        if (staOrdinando) {
            return; // Non permetto di cambiare mentre sta ordinando
        }
        const val = e.target.value;
        console.log("Dati algoritmo:", datiAlgoritmi[val]);
        titoloAlgoritmo.innerText = datiAlgoritmi[val].titolo;
        infoAlgoritmo.innerText = datiAlgoritmi[val].info;
        azzerapColoriBarr(); // Tolgo i colori dal precedente ordinamento
    });

    /**
     * EVENTO: Cambio dello slider di velocità
     * Aggiorna il visuale dello slider (il background gradient)
     * Non cambia la velocità dell'algoritmo direttamente
     * (quella si calcola in ottieniRitardo() durante l'ordinamento)
     */
    sliderVelocita.addEventListener("input", () => {
        const percentuale = (sliderVelocita.value / 100) * 100;
        sliderVelocita.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentuale}%, #334155 ${percentuale}%, #334155 100%)`;
    });

    /**
     * EVENTO: Click su "ORDINA"
     * 
     * STEPS:
     * 1. Controllo se già sta ordinando (non permetto ordinamenti multipli)
     * 2. Disabilito i bottoni durante l'ordinamento (per evitare conflitti)
     * 3. Resetto i contatori e i colori
     * 4. Leggo quale algoritmo è selezionato
     * 5. Chiamo la funzione corrispondente
     * 6. Coloro tutto di verde quando finito
     * 7. Riabilito i bottoni
     */
    btnOrdina.addEventListener("click", async () => {
        if (staOrdinando) {
            return; // Già sta ordinando, ignora il click
        }
        staOrdinando = true; // Segno che sto ordinando
        btnNuovoArray.disabled = true;
        btnOrdina.disabled = true;
        selAlgoritmo.disabled = true;
        azzerapContatori(); // Numero comparazioni e scambi: 0
        azzerapColoriBarr(); // Reimposta i colori

        const algo = selAlgoritmo.value;
        console.log("Avvio ordinamento con:", algo);
        
        // Scelgo quale funzione chiamare in base all'algoritmo selezionato
        if (algo === 'bubble') {
            await ordinaBubbleSort();
        } else if (algo === 'selection') {
            await ordinaSelectionSort();
        } else if (algo === 'insertion') {
            await ordinaInsertion();
        } else if (algo === 'quick') {
            await ordinaQuick(0, barre.length - 1);
        }

        // Coloro tutto di verde per segnalare che è finito
        barre.forEach(b => {
            b.element.classList.add("ordinata");
        });
        staOrdinando = false; // Segno che ho finito
        btnNuovoArray.disabled = false;
        btnOrdina.disabled = false;
        selAlgoritmo.disabled = false;
        console.log("Ordinamento completato!");
    });

    /* ========== INIZIALIZZAZIONE ==========
       Eseguito quando la pagina carica */
    console.log("Inizializzazione dell'applicazione...");
    creaNuovoArray(); // Genero il primo array
    // Imposta lo stile iniziale dello slider
    sliderVelocita.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 60%, #334155 60%, #334155 100%)`;
    console.log("Script caricato correttamente! Pronto per ordinare.");
});
