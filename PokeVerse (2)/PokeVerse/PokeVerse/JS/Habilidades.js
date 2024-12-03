// Carregar a lista de habilidades ao iniciar
        window.onload = async function() {
            const abilities = await fetchAbilities();
            displayAbilityList(abilities);
        };
    
        async function fetchAbilities() {
            const abilities = [];
            for (let i = 1; i <= 100; i++) { // Limitar a 100 habilidades para evitar muitos pedidos
                const response = await fetch(`https://pokeapi.co/api/v2/ability/${i}`);
                if (response.ok) {
                    const data = await response.json();
                    abilities.push(data.name);
                }
            }
            return abilities;
        }
    
        function displayAbilityList(abilities) {
            const abilityList = document.getElementById('abilityList');
            abilityList.innerHTML = abilities.map(ability => `<li onclick="setAbility('${ability}')">${capitalize(ability)}</li>`).join('');
        }
    
        function setAbility(ability) {
            document.getElementById('abilitySearch').value = ability;
            searchAbility();
        }
    
        async function searchAbility() {
            const searchValue = document.getElementById('abilitySearch').value.toLowerCase().trim();
            if (searchValue) {
                const ability = await fetchAbility(searchValue);
                if (ability) {
                    displayAbilityDetails(ability);
                    displayPokemonWithAbility(ability.pokemon);
                } else {
                    clearDisplay();
                }
            } else {
                clearDisplay();
            }
        }
    
        async function fetchAbility(name) {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/ability/${name}`);
                if (!response.ok) throw new Error('Habilidade não encontrada');
                const data = await response.json();
                return formatAbilityData(data);
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    
        function formatAbilityData(data) {
            return {
                name: data.name,
                effect: data.effect_entries.find(entry => entry.language.name === 'en').effect, // Pega o efeito da habilidade em inglês
                pokemon: data.pokemon.map(poke => poke.pokemon.name) // Pokémon que possuem a habilidade
            };
        }
    
        function clearDisplay() {
            document.getElementById('abilityDetails').innerHTML = '';
            document.getElementById('pokemonList').innerHTML = '';
        }
    
        async function translateDescription(text) {
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                return data.responseData.translatedText || text; // Retorna a tradução ou o texto original
            } catch (error) {
                console.error('Erro na tradução:', error);
                return text; // Retorna o texto original em caso de erro
            }
        }
    
        async function displayAbilityDetails(ability) {
            const translatedEffect = await translateDescription(ability.effect);
            const detailsDiv = document.getElementById('abilityDetails');
            detailsDiv.innerHTML = `
                <h3>${translateAbility(ability.name)}</h3>
                <p>${translatedEffect}</p>
            `;
        }

        async function displayAbilityDetails(ability) {
    // Verifica o comprimento da descrição da habilidade
    if (ability.effect.length > 500) {
        // Se a descrição for muito longa, use a descrição original
        var effectText = ability.effect; // Usa a descrição original
    } else {
        // Caso contrário, traduza a descrição
        var effectText = await translateDescription(ability.effect);
    }

    const detailsDiv = document.getElementById('abilityDetails');
    detailsDiv.innerHTML = `
        <h3>${translateAbility(ability.name)}</h3>
        <p>${effectText}</p>
    `;
}
    
        function displayPokemonWithAbility(pokemonList) {
            const listDiv = document.getElementById('pokemonList');
            listDiv.innerHTML = pokemonList.map(poke => `<li>${capitalize(poke)}</li>`).join('');
        }
    
        function translateAbility(ability) {
            const translations = {
                'static': 'Estático',
                'lightning-rod': 'Varinha de Raio',
                'blaze': 'Chama',
                'solar-power': 'Poder Solar'
                // Adicione mais traduções aqui conforme necessário
            };
            return translations[ability] || capitalize(ability); // Retorna a habilidade traduzida ou a habilidade original
        }
    
        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, ' '); // Capitaliza a primeira letra e substitui "-" por espaços
        }