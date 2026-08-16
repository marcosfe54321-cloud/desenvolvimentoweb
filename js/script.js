// ====================================
// EMPREENDA MAIS ELAS - SCRIPT
// ====================================

const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('empreendaTema');

if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    if (themeToggle) {
        themeToggle.textContent = '☀️ Tema claro';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');

        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('empreendaTema', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️ Tema claro' : '🌙 Tema escuro';
    });
}

const form = document.getElementById('formulario-contato');

if (form) {
    const statusMensagem = document.getElementById('statusMensagem');
    const fields = {
        nome: {
            input: document.getElementById('nome'),
            error: document.querySelector('[data-error-for="nome"]')
        },
        email: {
            input: document.getElementById('email'),
            error: document.querySelector('[data-error-for="email"]')
        },
        interesse: {
            input: document.getElementById('interesse'),
            error: document.querySelector('[data-error-for="interesse"]')
        },
        mensagem: {
            input: document.getElementById('mensagem'),
            error: document.querySelector('[data-error-for="mensagem"]')
        }
    };

    const mostrarErro = (campo, mensagem) => {
        const config = fields[campo];
        if (!config) return;

        config.input.classList.add('input-error');
        config.error.textContent = mensagem;
    };

    const limparErro = (campo) => {
        const config = fields[campo];
        if (!config) return;

        config.input.classList.remove('input-error');
        config.error.textContent = '';
    };

    Object.keys(fields).forEach((campo) => {
        const { input } = fields[campo];

        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                limparErro(campo);
            }
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let formularioValido = true;

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const interesse = document.getElementById('interesse').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        Object.keys(fields).forEach((campo) => limparErro(campo));

        if (!nome) {
            mostrarErro('nome', 'Por favor, informe seu nome completo.');
            formularioValido = false;
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!email) {
            mostrarErro('email', 'O e-mail é obrigatório.');
            formularioValido = false;
        } else if (!emailValido) {
            mostrarErro('email', 'Informe um e-mail válido.');
            formularioValido = false;
        }

        if (!interesse) {
            mostrarErro('interesse', 'Selecione uma área de interesse.');
            formularioValido = false;
        }

        if (!mensagem) {
            mostrarErro('mensagem', 'Escreva uma mensagem para a nossa equipe.');
            formularioValido = false;
        }

        if (!formularioValido) {
            statusMensagem.textContent = 'Por favor, corrija os campos destacados.';
            statusMensagem.className = 'status-mensagem erro';
            return;
        }

        statusMensagem.textContent = 'Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.';
        statusMensagem.className = 'status-mensagem sucesso';
        form.reset();
    });
}

console.log('Página carregada com sucesso!');
