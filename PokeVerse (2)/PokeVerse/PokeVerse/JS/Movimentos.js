async function fetchPokemon() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${searchInput}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Pokémon não encontrado');
    }
    const pokemonData = await response.json();

    // Mostrar nome e imagem do Pokémon
    const pokemonInfo = document.getElementById('pokemonInfo');
    pokemonInfo.innerHTML = `
      <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
      <h2>${pokemonData.name.toUpperCase()}</h2>
    `;

    const movesTableBody = document.querySelector('#movesTable tbody');
    movesTableBody.innerHTML = ''; // Limpa os movimentos anteriores

    // Filtrar os movimentos com nível de aprendizado
    let learnedMoves = pokemonData.moves.filter(move => {
      return move.version_group_details.some(detail => detail.level_learned_at > 0);
    });

    // Ordenar os movimentos pelo nível que são aprendidos
    learnedMoves.sort((a, b) => {
      const levelA = a.version_group_details.find(detail => detail.level_learned_at > 0).level_learned_at;
      const levelB = b.version_group_details.find(detail => detail.level_learned_at > 0).level_learned_at;
      return levelA - levelB;
    });

    // Preencher os dados dos movimentos na tabela
    for (const move of learnedMoves) {
      const versionDetails = move.version_group_details.find(detail => detail.level_learned_at > 0);
      const level = versionDetails.level_learned_at;
      const moveName = move.move.name;

      // Buscar detalhes do movimento
      const moveDetailsResponse = await fetch(move.move.url);
      const moveDetails = await moveDetailsResponse.json();

      // Preencher os dados na tabela
      const row = document.createElement('tr');
      const translatedType = translateType(moveDetails.type.name);
      const description = await translateDescription(moveDetails.effect_entries[0]?.short_effect || 'Sem descrição');
      
      row.innerHTML = `
        <td>Nível ${level} - ${moveName.charAt(0).toUpperCase() + moveName.slice(1)}</td>
        <td>${translatedType}</td>
        <td>${moveDetails.power || 'N/A'}</td>
        <td>${moveDetails.accuracy || 'N/A'}</td>
        <td>${description}</td>
      `;
      movesTableBody.appendChild(row);
    }
  } catch (error) {
    alert(error.message);
  }
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