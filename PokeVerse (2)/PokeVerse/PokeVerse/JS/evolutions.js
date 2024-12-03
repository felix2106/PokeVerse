// Acessa os dados do Pokémon e da evolução armazenados no localStorage
const selectedPokemon = JSON.parse(localStorage.getItem("selectedPokemon"));
const evolutions = JSON.parse(localStorage.getItem("evolutions"));
console.log(selectedPokemon);

// Exibe as informações do Pokémon
const pokemonDetails = document.getElementById("pokemonDetails");
const pokeName = selectedPokemon.poke.name.charAt(0).toUpperCase() + selectedPokemon.poke.name.slice(1);
pokemonDetails.innerHTML = `
    <h2>${pokeName} (#${selectedPokemon.poke.id})</h2>
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon.poke.id}.png" alt="${pokeName}">
`;

// Exibe a cadeia de evolução
const evolutionChain = document.getElementById("evolutionChain");
evolutions.forEach((evolution, index) => {
    const evolutionName = evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1);
    evolutionChain.innerHTML += `
        <div>
            <h3>Forma ${index + 1}: ${evolutionName}</h3>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png" alt="${evolutionName}">
        </div>
    `;
});
