const poke_container = document.querySelector(".container_pokemon");
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");
const pokemonCount = 1025;
let allPokemonData = [];

const getPokemons = async () => {
    for (let i = 1; i <= pokemonCount; i++) {
        await fetchPokemon(i);
    }
    displayPokemons(allPokemonData);
};

// Função para obter todos os tipos de Pokémon e preencher o select
const getAllPokemonTypes = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/type/');
    const data = await response.json();
    console.log(data)

    data.results.forEach(type => {
        if (!["unknown", "stellar"].includes(type.name)) { // Exclui os tipos 'unknown' e 'stellar'
            const option = document.createElement('option');
            option.value = type.name;
            option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
            typeFilter.appendChild(option);
        }
    });
    
};

const fetchPokemon = async (id) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await APIResponse.json();

    // Itera sobre os tipos do Pokémon e faz uma nova requisição para cada tipo
    
    const typesInfo = await Promise.all(
        data.types.map(async (type) => { // o map mapeia todos os typs pode ter mais de um (e como se fizesse duas dessa mesma se tiver dois tipos)
            const typeResponse = await fetch(type.type.url);
            const typeData = await typeResponse.json();
            const typeIconUrl = typeData.sprites["generation-viii"]["sword-shield"].name_icon; // Captura o ícone do tipo específico
            return { name: type.type.name, iconUrl: typeIconUrl }; // Retorna nome e URL do ícone 
            
        })
       
    );

    allPokemonData.push({ ...data, typesInfo }); // Armazena os dados do Pokémon
};

const createPokemonCard = (poke, typesInfo) => {
    const card_div = document.createElement('div');
    card_div.classList.add("card_pokemon");

    const name = poke.name[0].toUpperCase() + poke.name.slice(1);
    const id = poke.id.toString().padStart(3, '0');

    // Criando os ícones de tipo dinamicamente com URL do ícone específico
    const types = typesInfo.map(type => {
        return `<img src="${type.iconUrl}" alt="${type.name}">`;
    }).join("");

    const pokeinnerHTML = `
        <img class="pokemon_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png" alt="${name}">
        <h1>
            <span class="pokemon_number">#${id}</span>
            <span class="pokemon_name">${name}</span>
        </h1>
        <div class="pokemon_type">
            ${types}
        </div>
    `;
    card_div.innerHTML = pokeinnerHTML;

    card_div.addEventListener("click", async () => {
        // Armazena os dados do Pokémon no localStorage
        localStorage.setItem("selectedPokemon", JSON.stringify({ poke, typesInfo }));
        
        // Busca pela cadeia de evolução
        const evolutions = await getEvolutionChain(poke.id);
        
        // Armazena as evoluções no localStorage
        localStorage.setItem("evolutions", JSON.stringify(evolutions));
        
        // Redireciona para a página de detalhes
        window.location.href = "evolutions.html"; // Redireciona para a nova página
    });
    

    poke_container.appendChild(card_div);
};

const displayPokemons = (pokemonList) => {
    poke_container.innerHTML = ""; // Limpa o container
    pokemonList.forEach(pokemon => {
        createPokemonCard(pokemon, pokemon.typesInfo);
    });
};

typeFilter.addEventListener("change", () => {
    const selectedType = typeFilter.value;
    if (selectedType === "") {
        // Exibe todos os Pokémon se nenhum tipo estiver selecionado
        displayPokemons(allPokemonData);
    } else {
        // Filtra e exibe Pokémon pelo tipo selecionado
        const filteredPokemons = allPokemonData.filter(pokemon => 
            pokemon.typesInfo.some(type => type.name === selectedType)
        );
        displayPokemons(filteredPokemons);
    }
});
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredPokemons = allPokemonData.filter(pokemon => {
        return (
            pokemon.name.toLowerCase().includes(searchTerm) || 
            pokemon.id.toString().includes(searchTerm)
        );
    });

    displayPokemons(filteredPokemons);
});

// Função para buscar a cadeia de evoluções do Pokémon
const getEvolutionChain = async (pokemonId) => {
    try {
        // Pega a espécie do Pokémon para obter a URL da cadeia de evolução
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const speciesData = await speciesResponse.json();
        console.log("Species Data:", speciesData); // Verificando a resposta da espécie
        
        // Pega a URL da cadeia de evolução da espécie
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        
        console.log("Evolution Data:", evolutionData); // Verificando os dados da cadeia de evolução

        // Retorna a cadeia de evolução completa
        return parseEvolutionChain(evolutionData.chain);
    } catch (error) {
        console.error("Erro ao buscar a cadeia de evolução:", error);
        return [];
    }
};


// Função auxiliar para extrair a cadeia de evolução de forma recursiva
const parseEvolutionChain = (chain) => {
    let evolutions = [];
    let queue = [chain]; // Usamos uma fila para processar cada ramo da cadeia de evolução

    while (queue.length > 0) {
        let current = queue.shift();

        // Extrai o ID do Pokémon da URL
        const pokemonId = current.species.url.split('/').slice(-2, -1)[0];
        evolutions.push({
            name: current.species.name,
            id: pokemonId,
            details: current.evolution_details.map(detail => ({
                trigger: detail.trigger.name,
                item: detail.item ? detail.item.name : null,
                min_level: detail.min_level,
            })),
        });

        // Adiciona todas as evoluções possíveis à fila
        if (current.evolves_to.length > 0) {
            queue.push(...current.evolves_to);
        }
    }

    console.log("Evolutions:", evolutions); // Verificando a saída das evoluções
    return evolutions;
};


getAllPokemonTypes();
getPokemons();
