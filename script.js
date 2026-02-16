document.addEventListener('DOMContentLoaded', () => {
    console.log("Script iniziato");
    
    // --- ELEMENTI DOM ---
    const container = document.getElementById("array-container");
    const speedInput = document.getElementById("speedRange");
    const newArrayBtn = document.getElementById("newArrayBtn");
    const sortBtn = document.getElementById("sortBtn");
    const algoSelect = document.getElementById("algoSelect");
    const algoTitle = document.getElementById("algo-title");
    const algoInfo = document.getElementById("algo-info");
    const comparisonCount = document.getElementById("comparisonCount");
    const swapCount = document.getElementById("swapCount");

    console.log("Elementi DOM:", { container, speedInput, newArrayBtn, sortBtn, algoSelect, algoTitle, algoInfo });

    // --- VARIABILI GLOBALI ---
    let bars = [];
    let isSorting = false;
    const numberOfBars = 100;
    let comparisons = 0;
    let swaps = 0;

    // --- DATI ALGORITMI ---
    const algoData = {
        bubble: { title: "Bubble Sort", info: "Confronta elementi adiacenti e li scambia se sono nell'ordine sbagliato. Gli elementi più grandi 'affiorano' verso la fine." },
        selection: { title: "Selection Sort", info: "Cerca ripetutamente l'elemento minimo dalla parte non ordinata e lo sposta all'inizio dell'array." },
        insertion: { title: "Insertion Sort", info: "Costruisce l'ordinamento inserendo un elemento alla volta nella sua posizione corretta, come si fa con le carte." },
        quick: { title: "Quick Sort", info: "Usa un 'pivot' per dividere l'array in due sottogruppi (minori e maggiori del pivot) e li ordina ricorsivamente." }
    };

    /**
     * Attende per ms millisecondi
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Calcola il ritardo in base alla velocità selezionata
     */
    function getDelay() {
        return 200 - (speedInput.value * 1.8);
    }

    /**
     * Resetta i contatori
     */
    function resetCounters() {
        comparisons = 0;
        swaps = 0;
        updateCounters();
    }

    /**
     * Aggiorna i contatori nel DOM
     */
    function updateCounters() {
        comparisonCount.innerText = comparisons;
        swapCount.innerText = swaps;
    }

    /**
     * Crea un nuovo array casuale
     */
    function createNewArray() {
        if (isSorting) {
            return;
        }
        container.innerHTML = '';
        bars = [];
        resetCounters();
        const width = Math.floor(container.clientWidth / numberOfBars) - 2;

        for (let i = 0; i < numberOfBars; i++) {
            const height = Math.floor(Math.random() * 350) + 20;
            const bar = document.createElement("div");
            bar.className = "bar";
            bar.style.height = `${height}px`;
            bar.style.width = `${width}px`;
            container.appendChild(bar);
            bars.push({ element: bar, height: height });
        }
    }

    /**
     * Rimuove tutti i colori dalle barre
     */
    function resetBarColors() {
        bars.forEach(bar => {
            bar.element.classList.remove("sorted", "compare", "pivot");
        });
    }

    /**
     * Scambia due elementi nell'array
     */
    async function swap(i, j) {
        let temp = bars[i].height;
        bars[i].height = bars[j].height;
        bars[j].height = temp;
        bars[i].element.style.height = `${bars[i].height}px`;
        bars[j].element.style.height = `${bars[j].height}px`;
        swaps++;
        updateCounters();
    }

    // --- ALGORITMI DI ORDINAMENTO ---

    /**
     * Bubble Sort: confronta elementi adiacenti e li scambia
     */
    async function bubbleSort() {
        for (let i = 0; i < bars.length; i++) {
            for (let j = 0; j < bars.length - i - 1; j++) {
                bars[j].element.classList.add("compare");
                bars[j+1].element.classList.add("compare");
                comparisons++;
                updateCounters();
                await sleep(getDelay());
                if (bars[j].height > bars[j + 1].height) {
                    await swap(j, j + 1);
                }
                bars[j].element.classList.remove("compare");
                bars[j+1].element.classList.remove("compare");
            }
            bars[bars.length - 1 - i].element.classList.add("sorted");
        }
    }

    /**
     * Selection Sort: trova il minimo e lo sposta all'inizio
     */
    async function selectionSort() {
        for (let i = 0; i < bars.length; i++) {
            let minIdx = i;
            bars[i].element.classList.add("pivot");
            for (let j = i + 1; j < bars.length; j++) {
                bars[j].element.classList.add("compare");
                comparisons++;
                updateCounters();
                await sleep(getDelay());
                if (bars[j].height < bars[minIdx].height) {
                    if (minIdx !== i) {
                        bars[minIdx].element.classList.remove("pivot");
                    }
                    minIdx = j;
                    bars[minIdx].element.classList.add("pivot");
                }
                bars[j].element.classList.remove("compare");
            }
            await swap(i, minIdx);
            bars[minIdx].element.classList.remove("pivot");
            bars[i].element.classList.add("sorted");
        }
    }

    /**
     * Insertion Sort: inserisce elementi uno alla volta nella posizione corretta
     */
    async function insertionSort() {
        for (let i = 0; i < bars.length; i++) {
            let j = i;
            while (j > 0 && bars[j].height < bars[j - 1].height) {
                bars[j].element.classList.add("compare");
                comparisons++;
                updateCounters();
                await swap(j, j - 1);
                await sleep(getDelay());
                bars[j].element.classList.remove("compare");
                j--;
            }
            for (let k = 0; k <= i; k++) {
                bars[k].element.classList.add("sorted");
            }
        }
    }

    /**
     * Quick Sort: algoritmo divide et impera
     */
    async function quickSort(start, end) {
        if (start >= end) {
            if (start >= 0 && start < bars.length) {
                bars[start].element.classList.add("sorted");
            }
            return;
        }
        let pIdx = await partition(start, end);
        await quickSort(start, pIdx - 1);
        await quickSort(pIdx + 1, end);
    }

    /**
     * Partition per Quick Sort
     */
    async function partition(start, end) {
        let pivotVal = bars[end].height;
        bars[end].element.classList.add("pivot");
        let pIdx = start;
        for (let i = start; i < end; i++) {
            bars[i].element.classList.add("compare");
            comparisons++;
            updateCounters();
            await sleep(getDelay());
            if (bars[i].height < pivotVal) {
                await swap(i, pIdx);
                pIdx++;
            }
            bars[i].element.classList.remove("compare");
        }
        await swap(pIdx, end);
        bars[end].element.classList.remove("pivot");
        bars[pIdx].element.classList.add("sorted");
        return pIdx;
    }

    // --- GESTIONE EVENTI ---

    /**
     * Nuovo Array
     */
    newArrayBtn.addEventListener("click", createNewArray);

    /**
     * Cambio algoritmo
     */
    algoSelect.addEventListener("change", (e) => {
        console.log("Cambio algoritmo a:", e.target.value);
        if (isSorting) {
            return;
        }
        const val = e.target.value;
        console.log("Dati algoritmo:", algoData[val]);
        algoTitle.innerText = algoData[val].title;
        algoInfo.innerText = algoData[val].info;
        resetBarColors();
    });

    /**
     * Feedback visivo della velocità
     */
    speedInput.addEventListener("input", () => {
        const percent = (speedInput.value / 100) * 100;
        speedInput.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 ${percent}%, #334155 ${percent}%, #334155 100%)`;
    });

    /**
     * Ordina l'array
     */
    sortBtn.addEventListener("click", async () => {
        if (isSorting) {
            return;
        }
        isSorting = true;
        newArrayBtn.disabled = true;
        sortBtn.disabled = true;
        algoSelect.disabled = true;
        resetCounters();
        resetBarColors();

        const algo = algoSelect.value;
        if (algo === 'bubble') {
            await bubbleSort();
        } else if (algo === 'selection') {
            await selectionSort();
        } else if (algo === 'insertion') {
            await insertionSort();
        } else if (algo === 'quick') {
            await quickSort(0, bars.length - 1);
        }

        bars.forEach(b => {
            b.element.classList.add("sorted");
        });
        isSorting = false;
        newArrayBtn.disabled = false;
        sortBtn.disabled = false;
        algoSelect.disabled = false;
    });

    // --- INIZIALIZZAZIONE ---
    console.log("Inizializzazione...");
    createNewArray();
    // Imposta lo stile iniziale dello slider
    speedInput.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 60%, #334155 60%, #334155 100%)`;
    console.log("Script caricato correttamente");
});
