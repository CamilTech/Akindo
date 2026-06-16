// ==========================================
// 1. LÓGICA DO SLIDER / CARROSSEL
// ==========================================
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const container = document.querySelector('.container');
const items = document.querySelectorAll('.list .item');
const indicadores = document.querySelector('.indicadores');
const dots = indicadores.querySelectorAll('ul li');
const number = document.querySelector('.number');

let active = 0;
const firstPosition = 0;
const lastPosition = items.length - 1;

// Função responsável por atualizar o slide ativo e os indicadores na tela
function updateSlider() {
    // Remove a classe 'active' de todos os itens e bolinhas
    items.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Adiciona a classe 'active' apenas no slide e bolinha atuais
    items[active].classList.add('active');
    dots[active].classList.add('active');
    
    // Atualiza o painel numérico (ex: 01, 02, 03...)
    number.innerHTML = String(active + 1).padStart(2, '0');
}

// Evento para avançar o slide
nextButton.onclick = () => {
    active = active + 1 > lastPosition ? 0 : active + 1;
    updateSlider();
};

// Evento para voltar o slide
prevButton.onclick = () => {
    active = active - 1 < firstPosition ? lastPosition : active - 1;
    updateSlider();
};

// Inicializa o slider na primeira posição ao carregar a página
updateSlider();


// ==========================================
// 2. LÓGICA DA BARRA DE PESQUISA DINÂMICA
// ==========================================
const inputBusca = document.getElementById('inputBusca');
const searchBarContainer = document.querySelector('.search-bar');
const btnLimpar = document.getElementById('btnLimpar');

// Monitora a digitação do usuário no campo de busca
inputBusca.addEventListener('input', () => {
    const termo = inputBusca.value.trim();

    // Se houver texto, mostra o botão de limpar e adiciona classe estilizada
    if (termo.length > 0) {
        searchBarContainer.classList.add('has-text');
        btnLimpar.style.display = 'block';
    } else {
        searchBarContainer.classList.remove('has-text');
        btnLimpar.style.display = 'none';
    }
});

// Evento para o botão de limpar o campo de busca
btnLimpar.addEventListener('click', () => {
    inputBusca.value = ''; // Esvazia o input
    searchBarContainer.classList.remove('has-text'); // Remove estilo de preenchido
    btnLimpar.style.display = 'none'; // Esconde o próprio botão de limpar
    inputBusca.focus(); // Coloca o cursor de volta no campo de texto
});