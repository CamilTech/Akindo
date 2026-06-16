document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. SISTEMA ALTERNADOR DE MODO CLARO / ESCURO COM ALTERNÂNCIA DE IMAGENS
    // ==========================================================================
    const btnAlternarTema = document.getElementById("btnAlternarTema");
    const temaIcone = document.getElementById("temaIcone");

    if (btnAlternarTema && temaIcone) {
        btnAlternarTema.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            
            const isDarkMode = document.body.classList.contains("dark-mode");

            // Troca o ícone do botão de alternar tema dinamicamente
            if (isDarkMode) {
                temaIcone.src = "img/icone-sol.png"; 
                temaIcone.alt = "Modo Claro";
            } else {
                temaIcone.src = "img/icone-lua.png"; 
                temaIcone.alt = "Modo Escuro";
            }

            // GATILHO INTERATIVO DE IMAGENS: Troca todas as imagens que possuem o atributo data-dark
            const imagensComTema = document.querySelectorAll("img[data-dark]");
            imagensComTema.forEach(img => {
                // Guarda o src original do modo claro se ele ainda não tiver sido mapeado
                if (!img.getAttribute("data-light")) {
                    img.setAttribute("data-light", img.src);
                }

                if (isDarkMode) {
                    // Pega a imagem configurada para o Modo Escuro
                    const darkSrc = img.getAttribute("data-dark");
                    if (darkSrc) img.src = darkSrc;
                } else {
                    // Retorna para o arquivo original do Modo Claro
                    img.src = img.getAttribute("data-light");
                }
            });
        });
    }

    // ==========================================================================
    // 2. SISTEMA DO MENU LATERAL RETRÁTIL (OPEN / CLOSE SIDEBAR)
    // ==========================================================================
    const btnAbrirMenu = document.getElementById("btnAbrirMenu");
    const btnFecharMenu = document.getElementById("btnFecharMenu");
    const menuLateral = document.getElementById("menuLateral");
    const overlayMenu = document.getElementById("overlayMenu");
    const sidebarLinks = document.querySelectorAll(".sidebar-links a");

    if (btnAbrirMenu && menuLateral && overlayMenu) {
        const abrirMenu = () => {
            menuLateral.classList.add("active");
            overlayMenu.classList.add("active");
            document.body.style.overflow = "hidden";
        };

        const fecharMenu = () => {
            menuLateral.classList.remove("active");
            overlayMenu.classList.remove("active");
            document.body.style.overflow = "auto";
        };

        btnAbrirMenu.addEventListener("click", abrirMenu);
        if (btnFecharMenu) btnFecharMenu.addEventListener("click", fecharMenu);
        overlayMenu.addEventListener("click", fecharMenu);

        sidebarLinks.forEach(link => {
            link.addEventListener("click", fecharMenu);
        });
    }

    // ==========================================================================
    // 3. CONTROLE DE AUTOPLAY DE VÍDEOS
    // ==========================================================================
    const videos = document.querySelectorAll(".video-grid video, .editorial-video-box video");
    videos.forEach(video => {
        video.play().catch(error => {
            console.log("Autoplay retido.", error);
        });
    });

    // ==========================================================================
    // 4. MOTOR LÓGICO UNIFICADO DOS CARROSÉIS (ROUPAS, CONJUNTOS, NOVIDADES, PULSEIRAS)
    // ==========================================================================
    const carousels = document.querySelectorAll('[data-carousel]');
    
    function getItemsInView(track, width) {
        const isFusion = track.classList.contains('fusion-carousel-track');
        if (isFusion) {
            if (width <= 600) return 1;
            if (width <= 1200) return 2;
            return 3;
        } else {
            if (width <= 600) return 1;
            if (width <= 768) return 2;
            if (width <= 1200) return 3;
            return 4;
        }
    }

    const arrowsMapping = {};
    carousels.forEach(arrow => {
        const id = arrow.getAttribute('data-carousel');
        if (!arrowsMapping[id]) arrowsMapping[id] = { prev: null, next: null, index: 0 };
        
        if (arrow.classList.contains('prev')) arrowsMapping[id].prev = arrow;
        if (arrow.classList.contains('next')) arrowsMapping[id].next = arrow;
    });

    Object.keys(arrowsMapping).forEach(id => {
        const group = arrowsMapping[id];
        const track = document.getElementById(`track-${id}`);
        
        if (track && (group.prev || group.next)) {
            const updatePosition = () => {
                const items = track.querySelectorAll('.product-card');
                if (items.length === 0) return;
                const itemWidth = items[0].getBoundingClientRect().width;
                const gap = 20;
                track.style.transform = `translateX(-${group.index * (itemWidth + gap)}px)`;
            };

            if (group.next) {
                group.next.addEventListener('click', () => {
                    const items = track.querySelectorAll('.product-card');
                    const itemsInView = getItemsInView(track, window.innerWidth);
                    if (group.index < items.length - itemsInView) {
                        group.index++;
                        updatePosition();
                    }
                });
            }

            if (group.prev) {
                group.prev.addEventListener('click', () => {
                    if (group.index > 0) {
                        group.index--;
                        updatePosition();
                    }
                });
            }

            window.addEventListener('resize', () => {
                group.index = 0;
                track.style.transform = 'translateX(0px)';
            });
        }
    });

    // ==========================================================================
    // 5. MOTOR DO SLIDER SUPERIOR (DRAG & TOUCH BANNER)
    // ==========================================================================
    const sliderTrack = document.querySelector('.slider-track');
    const sliderSection = document.querySelector('.top-slider-banner');

    if (sliderTrack && sliderSection) {
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;
        let currentSlideIndex = 0;
        const totalSlides = document.querySelectorAll('.slider-slide').length;

        sliderSection.addEventListener('mousedown', dragStart);
        sliderSection.addEventListener('mouseup', dragEnd);
        sliderSection.addEventListener('mouseleave', dragEnd);
        sliderSection.addEventListener('mousemove', dragMove);

        sliderSection.addEventListener('touchstart', dragStart);
        sliderSection.addEventListener('touchend', dragEnd);
        sliderSection.addEventListener('touchmove', dragMove);

        function dragStart(event) {
            isDragging = true;
            startX = getPositionX(event);
            animationID = requestAnimationFrame(animation);
        }

        function dragMove(event) {
            if (!isDragging) return;
            const currentX = getPositionX(event);
            currentTranslate = prevTranslate + (currentX - startX);
        }

        function dragEnd() {
            isDragging = false;
            cancelAnimationFrame(animationID);
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && currentSlideIndex < totalSlides - 1) currentSlideIndex++;
            if (movedBy > 100 && currentSlideIndex > 0) currentSlideIndex--;

            setPositionByIndex();
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function animation() {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        }

        function setSliderPosition() {
            sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
        }

        function setPositionByIndex() {
            const width = sliderSection.clientWidth;
            currentTranslate = currentSlideIndex * -width;
            prevTranslate = currentTranslate;
            sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
        }

        window.addEventListener('resize', setPositionByIndex);
    }
});

// Coloque este bloco ao final do seu arquivo script.js existente, dentro ou fora do DOMContentLoaded.

document.addEventListener("DOMContentLoaded", () => {
    // Código anterior dos carrosséis e tema continua idêntico aqui em cima...

    // ==========================================================================
    // 6. MOTOR DO MODAL UNIFICADO COM REGRAS ESPECÍFICAS (1 A 9)
    // ==========================================================================
    
    // Mapeamento de imagens e suas variantes reais para testes
    const bancoVariantes = {
        "1": [
            "Contornar e pintar objeto de amarelo/dinossauroverde.png",
            "Contornar e pintar objeto de amarelo/dinossauroverde.png"
        ],
        "2": [
            "Contornar e pintar objeto de amarelo/boxinhos.png",
            "Contornar e pintar objeto de amarelo/boxinhos.png"
        ],
        "3": [
            "Contornar e pintar objeto de amarelo/croped.png",
            "Contornar e pintar objeto de amarelo/decosta.png",
            "Contornar e pintar objeto de amarelo/redemoinho.png"
        ],
        "4": [
            "Contornar e pintar objeto de amarelo/Conjuntos.png",
            "Contornar e pintar objeto de amarelo/pretocon.png",
            "Contornar e pintar objeto de amarelo/testando.png"
        ],
        "5": [
            "Contornar e pintar objeto de amarelo/henlyrosa.png",
            "Contornar e pintar objeto de amarelo/aproximado1.png.",
            "Contornar e pintar objeto de amarelo/aproxiamdo2.png"
        ],
        "6": [
            "Contornar e pintar objeto de amarelo/mlaha curtahenly.png",
            "Contornar e pintar objeto de amarelo/malhavermelha.png",
            "Contornar e pintar objeto de amarelo/malhabranca.png"
        ],
        "7": [
            "Contornar e pintar objeto de amarelo/vermelhohenly.png",
            "Contornar e pintar objeto de amarelo/vermelhohenly.png"
        ],
        "8": [
            "img/marromcropd.png",
            "Contornar e pintar objeto de amarelo/croped.png",
            "Contornar e pintar objeto de amarelo/cropedlaranja.png"
        ],
        "9": [
            "Contornar e pintar objeto de amarelo/finalmente.png"
            
        ]
    };

    // Seleção de elementos do Modal
    const modalOverlay = document.getElementById("modalOverlay");
    const btnFecharModal = document.getElementById("btnFecharModalUnificado");
    const modalMiniaturas = document.getElementById("modalMiniaturas");
    const imagemDestaque = document.getElementById("imagem-destaque");
    const imagemZoom = document.getElementById("imagem-zoom");
    const areaFoto = document.getElementById("area-foto");
    const caixaZoom = document.getElementById("caixa-zoom");
    const lente = document.getElementById("lente");
    
    const modalTitulo = document.getElementById("modalTitulo");
    const modalPreco = document.getElementById("modalPreco");
    const containerTamanhosModal = document.getElementById("containerTamanhosModal");

    // Captura o clique em qualquer card de produto do site
    const cardsProdutos = document.querySelectorAll(".product-card");
    
    cardsProdutos.forEach(card => {
        card.addEventListener("click", (e) => {
            // Evita abrir o modal se o usuário clicar especificamente no botão "Adicionar à Sacola" rápido
            if(e.target.classList.contains("add-to-bag")) return;

            const idProduto = card.getAttribute("data-id");
            const srcImagemOriginal = card.querySelector(".product-image-wrapper img").src;
            const nomeProduto = card.querySelector(".product-name").innerText;
            const precoProduto = card.querySelector(".product-price").innerText;

            // Injeta dados textuais nos campos do modal
            modalTitulo.innerText = nomeProduto;
            modalPreco.innerText = precoProduto;
            
            // Define imagens iniciais
            imagemDestaque.src = srcImagemOriginal;
            imagemZoom.src = srcImagemOriginal;

            // Limpa as miniaturas anteriores
            modalMiniaturas.innerHTML = "";
            modalMiniaturas.style.display = "flex";
            containerTamanhosModal.style.display = "none";

            // Regra lógica de exibição baseada no número informado
            if (["3", "4", "5", "6", "8"].includes(idProduto)) {
                // Precisa ter 3 quadrados (Cores/Derivações alternativas)
                const imagensVariantes = bancoVariantes[idProduto] || [srcImagemOriginal, srcImagemOriginal, srcImagemOriginal];
                
                imagensVariantes.forEach((src, index) => {
                    const imgMini = document.createElement("img");
                    imgMini.src = src;
                    imgMini.alt = `Variante ${index + 1}`;
                    if(index === 0) imgMini.classList.add("ativa");
                    
                    imgMini.addEventListener("click", () => {
                        trocarImagemDestaque(imgMini);
                    });
                    modalMiniaturas.appendChild(imgMini);
                });

            } else if (["1", "2", "7"].includes(idProduto)) {
                // Apenas 2 quadrados com a mesma imagem nativa + caixa seletora de tamanhos ativa
                containerTamanhosModal.style.display = "block";
                const imagensVariantes = bancoVariantes[idProduto] || [srcImagemOriginal, srcImagemOriginal];

                imagensVariantes.forEach((src, index) => {
                    const imgMini = document.createElement("img");
                    imgMini.src = src;
                    imgMini.alt = `Tamanho Variante ${index + 1}`;
                    if(index === 0) imgMini.classList.add("ativa");

                    imgMini.addEventListener("click", () => {
                        trocarImagemDestaque(imgMini);
                    });
                    modalMiniaturas.appendChild(imgMini);
                });

            } else {
                // Outros números ou sem variante cadastrada: Oculta a área de quadradinhos completamente
                modalMiniaturas.style.display = "none";
            }

            // Abre o modal na tela
            modalOverlay.style.display = "flex";
            document.body.style.overflow = "hidden";
        });
    });

    // Função auxiliar para chaveamento de miniatura
    function trocarImagemDestaque(miniaturaElement) {
        imagemDestaque.src = miniaturaElement.src;
        imagemZoom.src = miniaturaElement.src;

        const ativas = modalMiniaturas.querySelectorAll("img.ativa");
        ativas.forEach(at => at.classList.remove("ativa"));
        miniaturaElement.classList.add("ativa");
    }

    // Fechar Modal
    const fecharOModalGeral = () => {
        modalOverlay.style.display = "none";
        document.body.style.overflow = "auto";
        caixaZoom.style.display = "none";
        lente.style.display = "none";
    };

    if(btnFecharModal) btnFecharModal.addEventListener("click", fecharOModalGeral);
    
    // Fecha se clicar fora da caixa branca
    modalOverlay.addEventListener("click", (e) => {
        if(e.target === modalOverlay) fecharOModalGeral();
    });

    // ==========================================================================
    // 7. MOTOR REORGANIZADO DO ZOOM SEGURO E LENTE
    // ==========================================================================
    if (areaFoto && caixaZoom && lente) {
        areaFoto.addEventListener("mouseenter", () => {
            caixaZoom.style.display = "block";
            lente.style.display = "block";
        });

        areaFoto.addEventListener("mouseleave", () => {
            caixaZoom.style.display = "none";
            lente.style.display = "none";
        });

        areaFoto.addEventListener("mousemove", (e) => {
            const rect = areaFoto.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPercent = x / rect.width;
            const yPercent = y / rect.height;

            const zoom = 2.5;
            const lenteSize = 180;

            // Posicionamento Centralizado da Lente Redonda
            lente.style.left = `${x - lenteSize / 2}px`;
            lente.style.top = `${y - lenteSize / 2}px`;

            // Movimentação interna coordenada da janela ampliada
            const moveX = -(imagemZoom.offsetWidth * (zoom - 1) * xPercent);
            const moveY = -(imagemZoom.offsetHeight * (zoom - 1) * yPercent);

            imagemZoom.style.transform = `scale(${zoom})`;
            imagemZoom.style.left = `${moveX}px`;
            imagemZoom.style.top = `${moveY}px`;
        });
    }
});


