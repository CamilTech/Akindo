        // ==========================================
        // 1. LÓGICA DO CARROSSEL AUTOMÁTICO
        // ==========================================
        const carousel = document.getElementById('carousel');
        const dots = document.querySelectorAll('.dot');
        const totalImages = 4;
        let currentIndex = 0;
        function nextImage() {
        currentIndex = (currentIndex + 1) % totalImages;

        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
        });
        }
        setInterval(nextImage, 4000); // Passa a imagem a cada 4 segundos




        const form = document.getElementById('loginForm');
        const feedback = document.getElementById('feedbackMessage');

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede a página de atualizar

            const emailValue = document.getElementById('email').value;
            const passwordValue = document.getElementById('password').value;

            // Mostra status de carregamento
            feedback.className = "message";
            feedback.innerText = "Verificando credenciais...";
            feedback.style.display = "block";

            // REQUISIÇÃO HTTP (POST) PARA A API
            fetch('https://reqres.in/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json(); // Se a API responder OK (Status 200)
                } else {
                    throw new Error('Usuário não encontrado ou senha incorreta.'); // Se der erro (Status 400)
                }
            })
            .then(data => {
                // SUCESSO: O usuário existe na API
                feedback.classList.add('success');
                feedback.innerText = "Login realizado! Token recebido: " + data.token;
                console.log("Sucesso da API:", data);

                setTimeout(() => {
                    window.location.href = "../../pagina-inicial.html";
                }, 1000);
            })
            .catch(error => {
                // ERRO: Erro de digitação ou usuário inexistente
                feedback.classList.add('error');
                feedback.innerText = error.message;
                console.error("Erro da API:", error);
            });
        });