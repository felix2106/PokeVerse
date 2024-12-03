            async function fetchPokemonLocation() {
            const pokemonNameOrId = document.getElementById("locationInput").value.toLowerCase();
            const locationInfoDiv = document.getElementById("locationInfo");
            locationInfoDiv.innerHTML = "Carregando...";

            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`);
                if (!response.ok) throw new Error("Pokémon não encontrado.");
                const pokemonData = await response.json();

                const pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
                const pokemonImage = pokemonData.sprites.front_default;

                const locationResponse = await fetch(pokemonData.location_area_encounters);
                const locations = await locationResponse.json();

                const pokemonHeader = `
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${pokemonImage}" alt="${pokemonName}" style="width: 150px; height: 150px;">
                        <h2>${pokemonName}</h2>
                    </div>
                `;

                if (locations.length === 0) {
                    locationInfoDiv.innerHTML = `${pokemonHeader}<p>Este Pokémon não possui locais registrados.</p>`;
                    return;
                }

                let locationHTML = "<h3>Locais onde este Pokémon pode ser encontrado:</h3><ul>";
                locations.forEach(location => {
                    locationHTML += `<li>${location.location_area.name.replace(/-/g, " ")}</li>`;
                });
                locationHTML += "</ul>";

                locationInfoDiv.innerHTML = pokemonHeader + locationHTML;

            } catch (error) {
                locationInfoDiv.innerHTML = `<p>Erro: ${error.message}</p>`;
            }
        }
