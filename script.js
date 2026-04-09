let currentPokemonList = []; //meine leere array 
let currentDialogIndex = 0;  ///merken welche karte offen ist
let currentOffset = 0; ///wo fangen wir an zu lessen bei 0 fangen beim ersten pokemon an
let currentLimit = 20;  ///öffnen max 20 pokemon
let isLoading = false; ///steht auf true solange der browser noch lädt verhindert das der mehr laden knopf gedrüclt wird und chaos ensteht


async function init() {
    await loadPokemonData(currentLimit, currentOffset); ///0 und 15 wird mitgegeben
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
        let typClass = getPokemonClass(pokemon);
        let typesHtml = getTypesHtml(pokemon);
        html += getPokemonCardTemplate(i, pokemon.name, pokemon.sprites.front_default, typClass, pokemon.id, typesHtml); ///packt alles in mein body
    }
    container.innerHTML = html;
    document.getElementById("search-error").classList.add("d-none");
    ///sprites .name . front default ist der pfad von meinem ersten pokemon und zeigt an was ausgegeben wird 

}

function loadMorePokemon() {   ////one click im html sobald das geklickt wird wird diese funktion ausgeführt 
    if (!isLoading) {
        currentOffset = currentOffset + currentLimit; // Offset weiterzählen
        currentLimit = 30; // Ab dem zweiten Klick sollen es immer "10 pokemon mehr" sein
        loadPokemonData(currentLimit, currentOffset);
    }
}

function getPokemonClass(pokemon) {
    let typeName = pokemon.types[0].type.name; ///öffnet die schublade types greift nur nur die erste hauptklasse 
    return "bg-" + typeName;///bg steht für background wenn grass wirft sie grass zurück
}

function getStatsHtml(pokemon) {
    let html = "";

    for (let i = 0; i < pokemon.stats.length; i++) {
        let stat = pokemon.stats[i];


        html += getStatRowTemplate(stat.stat.name, stat.base_stat); //wir fragen das kleine template von drüben 
    }

    return html;
}
function getTypesHtml(pokemon) {
    let typesHtml = "";

    // Wir wühlen durch alle Elemente, die dieses Pokémon besitzt
    for (let i = 0; i < pokemon.types.length; i++) {
        let typeName = pokemon.types[i].type.name; // Findet z.B. das Wort "grass"
        typesHtml += getTypeIconTemplate(typeName);    // Wir bauen den Link zum Ordner zusammen und fügen ihn als Bild ein
    }

    return typesHtml;
}

function openDialog(i) {
    currentDialogIndex = i; // Wir merken uns  auf was du geklickt hast
    let pokemon = currentPokemonList[i];


    let typeClass = getPokemonClass(pokemon);
    let typesHtml = getTypesHtml(pokemon);
    let statsHtml = getStatsHtml(pokemon);

    let artwork = pokemon.sprites.other['official-artwork'].front_default;   ////speichern den link in artwork
    document.getElementById('pokemon-overlay').classList.remove('d-none');
    let htmlForDialog = getDialogTemplate(pokemon.name, artwork, pokemon.id, typeClass, typesHtml, statsHtml);  ////schmeis mir alles in dialog content mit template
    document.getElementById('dialog-content').innerHTML = htmlForDialog;
}



function closeDialog() {

    document.getElementById('pokemon-overlay').classList.add('d-none');  /// schliest mein dialog wieder
}

function nextPokemon(event) {
    event.stopPropagation();
    currentDialogIndex++;
    if (currentDialogIndex >= currentPokemonList.length) currentDialogIndex = 0;
    openDialog(currentDialogIndex);
}

function prevPokemon(event) {
    event.stopPropagation();
    currentDialogIndex--;
    if (currentDialogIndex < 0) currentDialogIndex = currentPokemonList.length - 1;
    openDialog(currentDialogIndex);
}

function checkSearchError(htmlString, isZuKurz) {
    let errorBox = document.getElementById("search-error");

    if (isZuKurz) {
        errorBox.innerHTML = "3 letters...";
        errorBox.classList.remove("d-none");
    } else if (htmlString === "") {
        errorBox.innerHTML = "Not Found";
        errorBox.classList.remove("d-none");
    } else {
        errorBox.classList.add("d-none");
    }
}

function searchPokemon() {
    let search = document.getElementById("search-input").value.toLowerCase();
    if (search.length > 0 && search.length < 3) {  ///checkt ob wirklich mindestens 3 drin sind sonst abbruch 
        checkSearchError("", true);
        return;
    }
    let html = "";
    for (let i = 0; i < currentPokemonList.length; i++) {
        let pokemon = currentPokemonList[i];
        if (pokemon.name.toLowerCase().includes(search)) {
            let typClass = getPokemonClass(pokemon);
            let typesHtml = getTypesHtml(pokemon);
            html += getPokemonCardTemplate(i, pokemon.name, pokemon.sprites.front_default, typClass, pokemon.id, typesHtml);
        }
    }
    document.getElementById("pokedex").innerHTML = html;
    checkSearchError(html, false); ///checkt nochma alles ab 
}
