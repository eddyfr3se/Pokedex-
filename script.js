let currentPokemonList = []; //meine leere array 

async function init() {
    await loadPokemonData();
    console.log(currentPokemonList)

}

async function loadPokemonData() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20`);
    let data = await response.json();
    console.log(data)

    let results = data.results;
    for (let i = 0; i < results.length; i++) {
        let detailResponse = await fetch(results[i].url); ///ergebnisse mit anzahl im link
        let pokemonDetails = await detailResponse.json();  ///packe es in ein json
        currentPokemonList.push(pokemonDetails);   //// hab mir jetzt die 20 in die currentPokemonList abgespeichert
    }
    renderPokedex();
}

function renderPokedex() {
    let container = document.getElementById("pokedex");
    let html = "";  ///sammelt unseren text

    for (let i = 0; i < currentPokemonList.length; i++) {  //geht nur die 20 gesammelten in der liste 
        let pokemon = currentPokemonList[i];
        html += `<div>
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.front_default}">
         </div>`;
    }
    container.innerHTML = html;
///sprites .name . front default ist der pfad von meinem ersten pokemon und zeigt an was ausgegeben wird 

}