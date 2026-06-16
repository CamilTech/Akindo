// --- LÓGICA DO SLIDER/CARROSSEL ---
let prevButton = document.getElementById('prev')
let nextButton = document.getElementById('next')
let container = document.querySelector('.container')
let items = document.querySelectorAll('.list .item')
let indicadores = document.querySelector('.indicadores')
let dots = indicadores.querySelectorAll('ul li')
let number = document.querySelector('.number')

let active = 0
let firstPosition = 0
let lastPosition = items.length - 1

function updateSlider() {
    items.forEach(item => {
        item.classList.remove('active')
    })
    dots.forEach(dot => {
        dot.classList.remove('active')
    })
    
    items[active].classList.add('active')
    dots[active].classList.add('active')
    
    number.innerHTML = String(active + 1).padStart(2, '0')
}

nextButton.onclick = () => {
    active = active + 1 > lastPosition ? 0 : active + 1
    updateSlider()
}

prevButton.onclick = () => {
    active = active - 1 < firstPosition ? lastPosition : active - 1
    updateSlider()
}

updateSlider()


// --- LÓGICA DA BARRA DE PESQUISA DINÂMICA ---
const inputBusca = document.getElementById('inputBusca');
const searchBarContainer = document.querySelector('.search-bar');
const btnLimpar = document.getElementById('btnLimpar');

inputBusca.addEventListener('input', () => {
    const termo = inputBusca.value.trim();

    if (termo.length > 0) {
        searchBarContainer.classList.add('has-text');
        btnLimpar.style.display = 'block';
    } else {
        searchBarContainer.classList.remove('has-text');
        btnLimpar.style.display = 'none';
    }
});

btnLimpar.addEventListener('click', () => {
    inputBusca.value = '';
    searchBarContainer.classList.remove('has-text');
    btnLimpar.style.display = 'none';
    inputBusca.focus();
});