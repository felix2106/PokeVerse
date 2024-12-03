let currentParalelogram = 1; // Começamos com o paralelogramo 1

const paralelogramos = document.querySelectorAll('.paralelogramo'); // Seleciona todos os paralelogramos

// Função para alternar entre os paralelogramos
function switchParalelogram(increment) {
    paralelogramos[currentParalelogram - 1].classList.remove('active'); // Remove a classe active do paralelogramo atual

    currentParalelogram += increment; // Incrementa ou decrementa o índice

    if (currentParalelogram > paralelogramos.length) {
        currentParalelogram = 1; // Se for maior que o número de paralelogramos, volta ao primeiro
    } else if (currentParalelogram < 1) {
        currentParalelogram = paralelogramos.length; // Se for menor que 1, vai para o último
    }

    paralelogramos[currentParalelogram - 1].classList.add('active'); // Adiciona a classe active ao paralelogramo selecionado
}

// Adiciona evento de clique nas setas
document.querySelectorAll('.seta-esquerda').forEach(seta => {
    seta.addEventListener('click', () => switchParalelogram(-1)); // Muda para o paralelogramo anterior
});

document.querySelectorAll('.seta-direita').forEach(seta => {
    seta.addEventListener('click', () => switchParalelogram(1)); // Muda para o próximo paralelogramo
});

// Inicializa o primeiro paralelogramo como ativo
paralelogramos[0].classList.add('active');
