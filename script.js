let currentPokemonList = [];
let renderedPokemonList = [];
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
    toggleLoadingUI(true);

    try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${loadLimit}&offset=${loadOffset}`);
        let data = await response.json();
        await fetchPokemonDetails(data.results);
    } catch (error) {
        console.error("Fehler laden vom Pokemon", error);
    }

    renderPokedex();
    isLoading = false;
    toggleLoadingUI(false);
}

function toggleLoadingUI(isStarting) {
    let btn = document.getElementById("load-more-btn");
    let screen = document.getElementById("loading-screen");

    if (isStarting) {
        if (btn) btn.innerHTML = "Loading...";
    } else {
        if (screen) screen.classList.remove("show");
        if (btn) btn.innerHTML = "Load more";
    }
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
    renderedPokemonList = [...currentPokemonList];
    for (let i = 0; i < renderedPokemonList.length; i++) {
        let pokemon = renderedPokemonList[i];
        let typClass = getPokemonClass(pokemon);
        let typesHtml = getTypesHtml(pokemon);
        html += getPokemonCardTemplate(i, pokemon, typClass, typesHtml);
    }
    container.innerHTML = html;
    document.getElementById("search-error").classList.add("d-none");
    let loadMoreContainer = document.querySelector(".load-more-container");
    if (loadMoreContainer) loadMoreContainer.style.display = "block";
}

function loadMorePokemon() {
    if (!isLoading) {
        document.getElementById("loading-screen").classList.add("show");
        currentOffset = currentOffset + currentLimit;
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
    let pokemon = renderedPokemonList[i];
    let typeClass = getPokemonClass(pokemon);
    let typesHtml = getTypesHtml(pokemon);
    let statsHtml = getStatsHtml(pokemon);
    let artwork = pokemon.sprites.other['official-artwork'].front_default;
    document.getElementById('pokemon-overlay').classList.remove('d-none');
    document.body.style.overflow = 'hidden';
    let htmlForDialog = getDialogTemplate(pokemon, artwork, typeClass, typesHtml, statsHtml);
    document.getElementById('dialog-content').innerHTML = htmlForDialog;
}

function closeDialog() {
    document.getElementById('pokemon-overlay').classList.add('d-none');
    document.body.style.overflow = '';
}

function nextPokemon(event) {
    event.stopPropagation();
    currentDialogIndex++;
    if (currentDialogIndex >= renderedPokemonList.length) currentDialogIndex = 0;
    openDialog(currentDialogIndex);
}

function prevPokemon(event) {
    event.stopPropagation();
    currentDialogIndex--;
    if (currentDialogIndex < 0) currentDialogIndex = renderedPokemonList.length - 1;
    openDialog(currentDialogIndex);
}

function checkSearchError(htmlString, isZuKurz) {
    let errorBox = document.getElementById("search-error");
    let loadMoreContainer = document.querySelector(".load-more-container");
    if (isZuKurz) {
        errorBox.innerHTML = "3 letters...";
        errorBox.classList.remove("d-none");
        setTimeout(() => errorBox.classList.add("d-none"), 2500);
        if (loadMoreContainer) loadMoreContainer.style.display = "none";
    } else if (htmlString === "") {
        errorBox.innerHTML = "Not Found";
        errorBox.classList.remove("d-none");
        if (loadMoreContainer) loadMoreContainer.style.display = "none";
    } else {
        errorBox.classList.add("d-none");
    }
}

function resetSearch() {
    document.getElementById("search-input").value = "";
    document.getElementById("reset-btn").classList.add("d-none");
    checkSearchError("", false);
    renderPokedex();
}

function searchPokemon() {
    let search = document.getElementById("search-input").value.toLowerCase();
    if (search.length === 0) return resetSearch();
    if (search.length < 3) return checkSearchError("", true);
    document.getElementById("reset-btn").classList.remove("d-none"); 
    let html = buildSearchResults(search);
    document.getElementById("pokedex").innerHTML = html;
    let loadMoreContainer = document.querySelector(".load-more-container");
    if (loadMoreContainer) loadMoreContainer.style.display = "none";
    checkSearchError(html, false);
}

function buildSearchResults(search) {
    let html = "";
    renderedPokemonList = [];

    for (let i = 0; i < currentPokemonList.length; i++) {
        let pokemon = currentPokemonList[i];
        if (pokemon.name.toLowerCase().includes(search)) {
            renderedPokemonList.push(pokemon);
            let displayIndex = renderedPokemonList.length - 1;
            html += getPokemonCardTemplate(displayIndex, pokemon, getPokemonClass(pokemon), getTypesHtml(pokemon));
        }
    }
    return html;
}
