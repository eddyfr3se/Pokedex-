async function init() {
    await loadPokemonData();

}

async function loadPokemonData() {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20`);
    let data = await response.json();
    console.log(data)
}