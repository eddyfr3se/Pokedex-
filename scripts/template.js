// Hier kommen unsere HTML-Templates hin
function getPokemonCardTemplate(pokemonIndex, pokemonName, pokemonImage, typeClass, pokemonId, typesHtml) {
    return `<div class="pokemon-card ${typeClass}" onclick="openDialog(${pokemonIndex})">
            <div class="card-header">
                <h2>${pokemonName}</h2>
                <span class="pokemon-id">#${pokemonId}</span>
            </div>
            <div class="card-body">
                <div class="types-container">
                    ${typesHtml}
                </div>
                <img src="${pokemonImage}">
            </div>
        </div>`;
}

function getDialogTemplate(pokemonName, artwork, pokemonId, typeClass, typesHtml, statsHtml) {
    return `
        <div class="dialog-card">
            <div class="dialog-top ${typeClass}">
                <b class="close-dialog" onclick="closeDialog()">X</b>
                <img src="${artwork}" class="dialog-pokemon-image">
            </div>
            
            <div class="dialog-bottom">
                
                <div class="dialog-nav">
                    <b class="nav-arrow" onclick="prevPokemon(event)"><</b>
                    <h2>${pokemonName} <span class="text-grey">#${pokemonId}</span></h2>
                    <b class="nav-arrow" onclick="nextPokemon(event)">></b>
                </div>

                <div class="dialog-types">
                    ${typesHtml}
                </div>

                <h4 class="stats-title">Base Stats</h4>
                <table class="stats-table">
                    ${statsHtml}
                </table>

            </div>
        </div>
    `;
}


function getStatRowTemplate(statName, statValue) {
    return `
        <tr>
            <td class="stat-name">${statName}</td>
            <td class="stat-number"><b>${statValue}</b></td>
        </tr>
    `;
}


function getTypeIconTemplate(typeName) {
    return `<img src="./img/Elements-Icon/${typeName}.svg" class="type-icon">`;
}
