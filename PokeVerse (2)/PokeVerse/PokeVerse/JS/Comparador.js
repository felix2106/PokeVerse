document.getElementById('compareButton').addEventListener('click', comparePokemons);

async function comparePokemons() {
    const pokemon1Name = document.getElementById('pokemon1').value.toLowerCase();
    const pokemon2Name = document.getElementById('pokemon2').value.toLowerCase();
    
    const poke1Data = await fetchPokemonData(pokemon1Name);
    const poke2Data = await fetchPokemonData(pokemon2Name);

    displayPokemonData(poke1Data, 'poke1');
    displayPokemonData(poke2Data, 'poke2');
}

async function fetchPokemonData(pokemon) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (!response.ok) throw new Error('Pokémon não encontrado');
        return await response.json();
    } catch (error) {
        alert(error.message);
        return null;
    }
}

function getRegion(data) {
    const id = data.id;

    if (id >= 1 && id <= 151) {
        return 'Kanto';
    } else if (id >= 152 && id <= 251) {
        return 'Johto';
    } else if (id >= 252 && id <= 386) {
        return 'Hoenn';
    } else if (id >= 387 && id <= 493) {
        return 'Sinnoh';
    } else if (id >= 494 && id <= 649) {
        return 'Unova';
    } else if (id >= 650 && id <= 721) {
        return 'Kalos';
    } else if (id >= 722 && id <= 809) {
        return 'Alola';
    } else if (id >= 810 && id <= 898) {
        return 'Galar';
    } else if (id >= 899) {
        return 'Paldea'; // ou outra região mais recente
    }

    return 'Região Desconhecida'; // Caso o número não esteja em nenhuma das faixas conhecidas.
}

function translateType(type) {
    const translations = {
        'grass': 'Grama',
        'fire': 'Fogo',
        'water': 'Água',
        'bug': 'Inseto',
        'normal': 'Normal',
        'flying': 'Voador',
        'poison': 'Veneno',
        'electric': 'Elétrico',
        'ground': 'Terra',
        'fairy': 'Fada',
        'fighting': 'Lutador',
        'psychic': 'Psíquico',
        'rock': 'Pedra',
        'ghost': 'Fantasma',
        'steel': 'Metal',
        'ice': 'Gelo',
        'dragon': 'Dragão',
        'dark': 'Sombrio'
    };
    return translations[type] || type; // Retorna o tipo traduzido ou o tipo original se não houver tradução
}

function translateStat(stat) {
    const translations = {
        'hp': 'Pontos de Vida',
        'attack': 'Ataque',
        'defense': 'Defesa',
        'special-attack': 'Ataque Especial',
        'special-defense': 'Defesa Especial',
        'speed': 'Velocidade'
    };
    return translations[stat] || stat; // Retorna a tradução ou o nome original se não houver tradução
}

function convertHeight(heightInDecimeters) {
    return (heightInDecimeters / 10).toFixed(2); // Convertendo de decímetros para metros
}

function convertWeight(weightInHectograms) {
    return (weightInHectograms / 10).toFixed(2); // Convertendo de hectogramas para quilos
}

function displayPokemonData(data, elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';

    if (!data) return;

    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const img = data.sprites.front_default;
    const heightInMeters = convertHeight(data.height);
    const weightInKilos = convertWeight(data.weight);
    const stats = data.stats.map(stat => `${translateStat(stat.stat.name)}: ${stat.base_stat}`).join('<br>');
    const types = data.types.map(type => translateType(type.type.name)).join(', ');
    const region = getRegion(data);

    element.innerHTML = `
        <h2>${name}</h2>
        <img src="${img}" alt="${name}" />
        <p>Altura: ${heightInMeters} m</p>
        <p>Peso: ${weightInKilos} kg</p>
        <p>Tipos: ${types}</p>
        <p>Região: ${region}</p>
        <p>Estatísticas:<br>${stats}</p>
    `;
}


function displayPokemonData(data, elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '';

    if (!data) return;

    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    const img = data.sprites.front_default;
    const heightInMeters = convertHeight(data.height);
    const weightInKilos = convertWeight(data.weight);
    const stats = data.stats.map(stat => `<div style="margin: 5px 0;">${translateStat(stat.stat.name)}: <u>${stat.base_stat}</u></div>`).join('');
    const types = data.types.map(type => `<u>${translateType(type.type.name)}</u>`).join(', ');
    const region = `<u>${getRegion(data)}</u>`;

    element.innerHTML = `
        <h2 style="color: black;">${name}</h2> <!-- Mudando a cor do nome para preto -->
        <img src="${img}" alt="${name}" />
        <div style="margin-bottom: 30px; border-bottom: 3px solid black; width: 100%; padding-bottom: 10px;">
            <h3 style="color: blue; display: inline; margin-bottom: 10px;">Altura:</h3>
            <p style="display: inline; margin-left: 10px; margin-bottom: 10px; color: black; text-align: justify;">${heightInMeters} m</p>
        </div>
        <div style="margin-bottom: 30px; border-bottom: 3px solid black; width: 100%; padding-bottom: 10px;">
            <h3 style="color: blue; display: inline; margin-bottom: 10px;">Peso:</h3>
            <p style="display: inline; margin-left: 10px; margin-bottom: 10px; color: black; text-align: justify;">${weightInKilos} kg</p>
        </div>
        <div style="margin-bottom: 30px; border-bottom: 3px solid black; width: 100%; padding-bottom: 10px;">
            <h3 style="color: blue; display: inline; margin-bottom: 10px;">Tipos:</h3>
            <p style="display: inline; margin-left: 10px; margin-bottom: 10px; color: black; text-align: justify;">${types}</p>
        </div>
        <div style="margin-bottom: 30px; border-bottom: 3px solid black; width: 100%; padding-bottom: 10px;">
            <h3 style="color: blue; display: inline; margin-bottom: 10px;">Região:</h3>
            <p style="display: inline; margin-left: 10px; margin-bottom: 10px; color: black; text-align: justify;">${region}</p>
        </div>
        <div style="margin-bottom: 30px; border-bottom: 3px solid black; width: 100%; padding-bottom: 20px; margin-top: 20px; text-align: center;">
            <h3 style="color: blue; display: inline; margin-bottom: 10px;">Estatísticas:</h3>
            <div style="margin-left: 10px; color: black; text-align: center;">
                ${stats}
            </div>
        </div>
    `;
}

document.getElementById('clearButton').addEventListener('click', () => {
    // Limpa os campos de entrada
    const pokemon1Input = document.getElementById('pokemon1');
    const pokemon2Input = document.getElementById('pokemon2');
    pokemon1Input.value = ''; // Limpa o texto do campo do Pokémon 1
    pokemon2Input.value = ''; // Limpa o texto do campo do Pokémon 2

    // Limpa as informações exibidas no contêiner
    const poke1 = document.getElementById('poke1');
    const poke2 = document.getElementById('poke2');
    comparisonContainer.innerHTML = ''; // Remove o conteúdo do contêiner
});

