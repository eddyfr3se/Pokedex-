// Hier kommen später unsere HTML-Templates hin
function getPokemonCardTemplate(pokemonIndex, pokemonName, pokemonImage) {
    return `<div class="pokemon-card">
            <h2>${pokemonName}</h2>
            <img src="${pokemonImage}">
         </div>`;
}
