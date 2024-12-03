        let score = 0;
        let difficulty = "easy";

        async function fetchRandomPokemon() {
            const randomId = Math.floor(Math.random() * 898) + 1;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            return await response.json();
        }

        function generateOptions(correctAnswer, category) {
            const options = [correctAnswer];
            while (options.length < 4) {
                let randomValue;
                if (category === "type") {
                    randomValue = ["fire", "water", "grass", "electric"][Math.floor(Math.random() * 4)];
                } else if (category === "height") {
                    randomValue = (Math.random() * 20).toFixed(1) + "m"; // Altura com "m"
                } else if (category === "weight") {
                    randomValue = (Math.random() * 200).toFixed(1) + "kg"; // Peso com "kg"
                } else {
                    randomValue = "habilidade aleatória";
                }
                if (!options.includes(randomValue)) options.push(randomValue);
            }
            return options.sort(() => Math.random() - 0.5);
        }

        async function generateQuestion() {
            const pokemon = await fetchRandomPokemon();
            const categories = {
                easy: ["type"],
                medium: ["type", "abilities"],
                hard: ["type", "height", "weight"],
                expert: ["type", "height", "weight", "abilities"]
            };

            const selectedCategory = categories[difficulty][Math.floor(Math.random() * categories[difficulty].length)];
            let question, correctAnswer;

            switch (selectedCategory) {
                case "type":
                    question = `Qual é o tipo de ${pokemon.name}?`;
                    correctAnswer = pokemon.types[0].type.name;
                    break;
                case "height":
                    question = `Qual é a altura de ${pokemon.name}?`;
                    correctAnswer = (pokemon.height / 10).toFixed(1) + "m";
                    break;
                case "weight":
                    question = `Qual é o peso de ${pokemon.name}?`;
                    correctAnswer = (pokemon.weight / 10).toFixed(1) + "kg";
                    break;
                case "abilities":
                    question = `Qual dessas é uma habilidade de ${pokemon.name}?`;
                    correctAnswer = pokemon.abilities[0].ability.name;
                    break;
                default:
                    question = "Pergunta inválida";
                    correctAnswer = "Resposta inválida";
            }

            const options = generateOptions(correctAnswer, selectedCategory);
            displayQuestion(question, options, correctAnswer);
        }

        function displayQuestion(questionText, options, correctAnswer) {
            document.getElementById('questionText').innerText = questionText;
            options.forEach((option, index) => {
                const button = document.getElementById(`option${index}`);
                button.innerText = option;
                button.onclick = () => checkAnswer(option === correctAnswer);
            });
            document.getElementById('resultMessage').innerText = "";
        }

        function checkAnswer(isCorrect) {
            const resultMessage = document.getElementById('resultMessage');
            if (isCorrect) {
                score += 10;
                document.getElementById('score').innerText = `Pontuação: ${score}`;
                resultMessage.innerText = "Correto!";
                resultMessage.style.color = "lightgreen";
                setTimeout(() => generateQuestion(), 2000);
            } else {
                resultMessage.innerText = "Incorreto!";
                resultMessage.style.color = "red";
                document.getElementById('gameOver').style.display = "block";
            }
        }

        function startQuiz(selectedDifficulty) {
            difficulty = selectedDifficulty;
            document.getElementById('difficultySelection').style.display = "none";
            document.getElementById('quizContainer').style.display = "block";
            score = 0;
            document.getElementById('score').innerText = "Pontuação: 0";
            generateQuestion();
        }

        function restartQuiz() {
            document.getElementById('gameOver').style.display = "none";
            startQuiz(difficulty);
        }