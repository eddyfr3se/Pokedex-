let currentPokemonList = []; //meine leere array 
let currentOffset = 0; ///wo fangen wir an zu lessen bei 0 fangen beim ersten pokemon an
let currentLimit = 20;  ///öffnen max 20 pokemon
let isLoading = false; ///steht auf true solange der browser noch lädt verhindert das der mehr laden knopf gedrüclt wird und chaos ensteht


async function init() {
    await loadPokemonData();
    console.log(currentPokemonList);

}


async function loadPokemonData(loadLimit, loadOffset) {
    if (isLoading) return; // Wenn er schon lädt, nicht nochmal anstoßen
    isLoading = true;

    // Lade-Button Feedback geben
    let btn = document.getElementById("load-more-btn");
    if (btn) btn.innerHTML = "Lade...";


    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${loadLimit}&offset=${loadOffset}`); ///loadlimit erst 20 dann 10 wenn button geklickt wird load offset das er bescheid weiß wo er weiter macht
        let data = await response.json();
        console.log("Liste geladen:", data);

        // Hier rufen wir die neue zweite Funktion auf und übergeben ihr die Liste:
        await fetchPokemonDetails(data.results);

    } catch (error) {
        // Falls irgendwo im try-Block das Internet ausfällt:
        console.error("Fehler laden vom Pokemon", error);
    }
    renderPokedex(); // Das Rendern lassen wir draußen, das soll auf jeden Fall am Ende versucht werden
    isLoading = false;
    // Lade-Button Text zurücksetzen
    if (btn) btn.innerHTML = "Mehr laden";
}

async function fetchPokemonDetails(results) {
    for (let i = 0; i < results.length; i++) { ///geht meine 20 durch packt alles in meine currentPokemonList
        let detailResponse = await fetch(results[i].url); 
        let pokemonDetails = await detailResponse.json();  ////packt meine ergebniss in pokemonDetailsjson
        currentPokemonList.push(pokemonDetails);    ////packt alles in meine liste  oben
    }
}


function renderPokedex() {
    let container = document.getElementById("pokedex");
    let html = "";  ///sammelt unseren text

    for (let i = 0; i < currentPokemonList.length; i++) {  //geht nur die 20 gesammelten in der liste 
        let pokemon = currentPokemonList[i];
        html += getPokemonCardTemplate(i, pokemon.name, pokemon.sprites.front_default); ///packt alles in mein body
    }
    container.innerHTML = html;
    ///sprites .name . front default ist der pfad von meinem ersten pokemon und zeigt an was ausgegeben wird 

}

function loadMorePokemon() {   ////one click im html sobald das geklickt wird wird diese funktion ausgeführt 
    if (!isLoading) {
        currentOffset = currentOffset + currentLimit; // Offset weiterzählen
        currentLimit = 10; // Ab dem zweiten Klick sollen es immer "10 pokemon mehr" sein
        loadPokemonData(currentLimit, currentOffset);
    }
}