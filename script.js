let currentPokemonList = [];
let currentDialogIndex = 0;
let currentOffset = 0;
let currentLimit = 20;
let isLoading = false;


async function init() {
    await loadPokemonData(currentLimit, currentOffset);
    console.log(currentPokemonList);
}


async function loadPokemonData(loadLimit, loadOffset) {
    if (isLoading) return;
    isLoading = true;


    let btn = document.getElementById("load-more-btn");
    if (btn) btn.innerHTML = "Lade...";
    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${loadLimit}&offset=${loadOffset}`);
        let data = await response.json();
        console.log("Liste geladen:", data);

        await fetchPokemonDetails(data.results);
    } catch (error) {
        console.error("Fehler laden vom Pokemon", error);
    }
    renderPokedex();
    isLoading = false;
    if (btn) btn.innerHTML = "Mehr laden";
}

async function fetchPokemonDetails(results) {
    for (let i = 0; i < results.length; i++) {
        let detailResponse = await fetch(results[i].url);
        let pokemonDetails = await detailResponse.json();
        currentPokemonList.push(pokemonDetails);
    }
}


function renderPokedex() {
    let container = document.getElementById("pokedex");
    let html = "";

    for (let i = 0; i < currentPokemonList.length; i++) {
        let pokemon = currentPokemonList[i];
        let typClass = getPokemonClass(pokemon);
        let typesHtml = getTypesHtml(pokemon);
        html += getPokemonCardTemplate(i, pokemon.name, pokemon.sprites.front_default, typClass, pokemon.id, typesHtml);
    }
    container.innerHTML = html;
    document.getElementById("search-error").classList.add("d-none");


}

function loadMorePokemon() {
    if (!isLoading) {
        currentOffset = currentOffset + currentLimit;
        currentLimit = 30;
        loadPokemonData(currentLimit, currentOffset);
    }
}

function getPokemonClass(pokemon) {
    let typeName = pokemon.types[0].type.name;
    return "bg-" + typeName;
}

function getStatsHtml(pokemon) {
    let html = "";

    for (let i = 0; i < pokemon.stats.length; i++) {
        let stat = pokemon.stats[i];


        html += getStatRowTemplate(stat.stat.name, stat.base_stat);
    }

    return html;
}
function getTypesHtml(pokemon) {
    let typesHtml = "";
    for (let i = 0; i < pokemon.types.length; i++) {
        let typeName = pokemon.types[i].type.name;
        typesHtml += getTypeIconTemplate(typeName);
    }

    return typesHtml;
}

function openDialog(i) {
    currentDialogIndex = i;
    let pokemon = currentPokemonList[i];


    let typeClass = getPokemonClass(pokemon);
    let typesHtml = getTypesHtml(pokemon);
    let statsHtml = getStatsHtml(pokemon);

    let artwork = pokemon.sprites.other['official-artwork'].front_default;
    document.getElementById('pokemon-overlay').classList.remove('d-none');
    let htmlForDialog = getDialogTemplate(pokemon.name, artwork, pokemon.id, typeClass, typesHtml, statsHtml);
    document.getElementById('dialog-content').innerHTML = htmlForDialog;
}



function closeDialog() {

    document.getElementById('pokemon-overlay').classList.add('d-none');
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
        setTimeout(() => errorBox.classList.add("d-none"), 2500);
    } else if (htmlString === "") {
        errorBox.innerHTML = "Not Found";
        errorBox.classList.remove("d-none");
        setTimeout(() => errorBox.classList.add("d-none"), 2500);
    } else {
        errorBox.classList.add("d-none");
    }
}

function searchPokemon() {
    let search = document.getElementById("search-input").value.toLowerCase();
    if (search.length > 0 && search.length < 3) {
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
    checkSearchError(html, false);
}
