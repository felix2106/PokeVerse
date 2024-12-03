async function fetchPokemon() {
    const pokemonInput = document.getElementById('pokemonInput').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Pokémon não encontrado');
        }
        const pokemon = await response.json();

        // Segunda chamada para obter a descrição
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        const flavorTextEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en') 
            || speciesData.flavor_text_entries[0];

        const description = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/[^a-zA-Z0-9.,’' ]/g, '').trim() : 'Descrição não encontrada';
        const translatedDescription = await translateDescription(description);
        displayPokemon(pokemon, translatedDescription);
    } catch (error) {
        displayError(error.message);
    }
}

async function translateDescription(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.responseData.translatedText || text;
    } catch (error) {
        console.error('Erro na tradução:', error);
        return text;
    }
}

function displayPokemon(pokemon, description) {
    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p><strong>ID:</strong> ${pokemon.id}</p>
        <p><strong>Tipo:</strong> ${pokemon.types.map(type => translateType(type.type.name)).join(', ')}</p>
        <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Descrição:</strong> ${description}</p>
    `;
    
    // Animação de fade-in para as informações do Pokémon
    pokemonInfo.style.opacity = 0; // Inicia invisível
    setTimeout(() => {
        pokemonInfo.style.transition = 'opacity 0.5s';
        pokemonInfo.style.opacity = 1; // Torna visível
    }, 10);
}

function displayError(message) {
    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.innerHTML = `<p style="color: red;">${message}</p>`;
    
    // Animação de piscar para erro
    pokemonInfo.style.animation = 'shake 0.5s';
}

function translateType(type) {
    const translations = {
        "normal": "Normal",
        "fire": "Fogo",
        "water": "Água",
        "electric": "Elétrico",
        "grass": "Grama",
        "ice": "Gelo",
        "fighting": "Lutador",
        "poison": "Veneno",
        "ground": "Terra",
        "flying": "Voador",
        "psychic": "Psíquico",
        "bug": "Inseto",
        "rock": "Pedra",
        "ghost": "Fantasma",
        "dragon": "Dragão",
        "dark": "Sombrio",
        "steel": "Aço",
        "fairy": "Fada"
    };
    return translations[type] || type.charAt(0).toUpperCase() + type.slice(1);
}


function displayPokemon(pokemon, description) {
    const pokemonInfo = document.getElementById('pokemonInfo');

    pokemonInfo.innerHTML = `
        <h2 style="text-align: center;">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <div style="text-align: center; margin-top: 20px;">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" 
                 style="border-radius: 50%; border: 5px solid black; width: 150px; height: 150px; display: block; margin: 0 auto;">
        </div>
        <div style="margin-top: 30px;">
            <div style="margin-bottom: 30px; border-bottom: 3px solid black; padding-bottom: 10px;"> <!-- Aumentei a espessura da borda -->
                <h3 style="color: blue; display: inline; margin-bottom: 10px;">ID:</h3> 
                <p style="display: inline; margin-left: 10px; margin-bottom: 10px;">${pokemon.id}</p>
            </div>
            <div style="margin-bottom: 30px; border-bottom: 3px solid black; padding-bottom: 10px;"> <!-- Aumentei a espessura da borda -->
                <h3 style="color: blue; display: inline; margin-bottom: 10px;">Tipo:</h3> 
                <p style="display: inline; margin-left: 10px; margin-bottom: 10px;">${pokemon.types.map(type => translateType(type.type.name)).join(', ')}</p>
            </div>
            <div style="margin-bottom: 30px; border-bottom: 3px solid black; padding-bottom: 10px;"> <!-- Aumentei a espessura da borda -->
                <h3 style="color: blue; display: inline; margin-bottom: 10px;">Altura:</h3> 
                <p style="display: inline; margin-left: 10px; margin-bottom: 10px;">${pokemon.height / 10} m</p>
            </div>
            <div style="margin-bottom: 30px; border-bottom: 3px solid black; padding-bottom: 10px;"> <!-- Aumentei a espessura da borda -->
                <h3 style="color: blue; display: inline; margin-bottom: 10px;">Peso:</h3> 
                <p style="display: inline; margin-left: 10px; margin-bottom: 10px;">${pokemon.weight / 10} kg</p>
            </div>
            <div style="margin-bottom: 30px; border-bottom: 3px solid black; padding-bottom: 10px;"> <!-- Aumentei a espessura da borda -->
                <h3 style="color: blue; display: inline; margin-bottom: 10px;">Descrição:</h3>
                <p style="margin-left: 10px; text-align: justify; line-height: 1.1; margin-bottom: 10px;">${description}</p>
            </div>
        </div>
    `;

    // Ajustes para animação e layout
    pokemonInfo.style.width = '31vw'; // Ajuste a largura
    pokemonInfo.style.height = '600px'; // Ajuste a altura
    pokemonInfo.style.padding = '30px'; // Ajuste o preenchimento
    pokemonInfo.style.opacity = 0; // Inicia invisível
    setTimeout(() => {
        pokemonInfo.style.opacity = 1; // Torna visível após a animação
    }, 10);
}

document.getElementById('clearButton').addEventListener('click', () => {
    const inputField = document.getElementById('pokemonInput');
    const pokemonInfo = document.getElementById('pokemonInfo');

    inputField.value = ''; // Limpa o texto do campo de entrada
    pokemonInfo.innerHTML = ''; // Limpa as informações do Pokémon exibidas
});
