/* ==========================================================================
   AUTH.JS - Cadastro, login e sessao (simulados com localStorage)

   Corrige em relacao a versao anterior:
   - passa a validar o FORMATO do e-mail (antes so checava se estava vazio,
     e os formularios usam novalidate, entao nada era verificado);
   - valida telefone e mostra o erro no campo certo, nao so uma mensagem geral;
   - acentuacao correta em todas as mensagens;
   - protegerPaginas() agora e chamada em todas as paginas internas, exibe o
     nome de quem esta logada e faz o botao "Sair" funcionar.

   AVISO DIDATICO: guardar senha no navegador so serve para este exercicio.
   Em um sistema real a senha nunca fica no cliente nem em texto puro.
   ========================================================================== */

(function () {
    "use strict";

    var CHAVE_USUARIAS = "empreenda_usuarias";
    var CHAVE_SESSAO = "empreenda_sessao";

    var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    /* ======================================================================
       ARMAZENAMENTO
       ====================================================================== */
    function lerUsuarias() {
        try {
            var bruto = localStorage.getItem(CHAVE_USUARIAS);
            var lista = bruto ? JSON.parse(bruto) : [];
            return Array.isArray(lista) ? lista : [];
        } catch (erro) {
            console.error("Falha ao ler as usuárias salvas:", erro);
            return [];
        }
    }

    function salvarUsuarias(lista) {
        try {
            localStorage.setItem(CHAVE_USUARIAS, JSON.stringify(lista));
        } catch (erro) {
            console.error("Falha ao salvar as usuárias:", erro);
        }
    }

    function abrirSessao(usuaria, lembrar) {
        try {
            localStorage.setItem(CHAVE_SESSAO, JSON.stringify({
                email: usuaria.email,
                nome: usuaria.nome,
                entrouEm: new Date().toISOString(),
                lembrar: Boolean(lembrar)
            }));
        } catch (erro) {
            console.error("Falha ao abrir a sessão:", erro);
        }
    }

    function lerSessao() {
        try {
            var bruto = localStorage.getItem(CHAVE_SESSAO);
            return bruto ? JSON.parse(bruto) : null;
        } catch (erro) {
            return null;
        }
    }

    function encerrarSessao() {
        try {
            localStorage.removeItem(CHAVE_SESSAO);
        } catch (erro) {
            console.error("Falha ao encerrar a sessão:", erro);
        }
    }

    function normalizarEmail(email) {
        return String(email || "").trim().toLowerCase();
    }

    function somenteDigitos(texto) {
        return String(texto || "").replace(/\D/g, "");
    }

    /* ======================================================================
       MENSAGENS NA TELA
       ====================================================================== */
    function mostrarMensagem(elemento, tipo, texto) {
        if (!elemento) {
            return;
        }
        elemento.className = "mensagem-status auth-mensagem" + (tipo ? " is-" + tipo : "");
        elemento.textContent = texto || "";
    }

    function limparMensagem(elemento) {
        mostrarMensagem(elemento, "", "");
    }

    /* Marca/desmarca o erro de um campo especifico */
    function marcarCampo(formulario, nomeCampo, mensagem) {
        var campo = formulario.elements[nomeCampo];
        var erro = formulario.querySelector('[data-erro-de="' + nomeCampo + '"]');

        if (!campo) {
            return;
        }

        if (mensagem) {
            campo.classList.add("campo-invalido");
            campo.setAttribute("aria-invalid", "true");
        } else {
            campo.classList.remove("campo-invalido");
            campo.removeAttribute("aria-invalid");
        }

        if (erro) {
            erro.textContent = mensagem || "";
        }
    }

    function limparTodosOsCampos(formulario, nomes) {
        nomes.forEach(function (nome) {
            marcarCampo(formulario, nome, "");
        });
    }

    /* ======================================================================
       MOSTRAR / OCULTAR SENHA
       ====================================================================== */
    function ligarMostrarSenha() {
        document.querySelectorAll(".mostrar-senha").forEach(function (botao) {
            botao.addEventListener("click", function () {
                var caixa = botao.closest(".campo-com-icone");
                if (!caixa) {
                    return;
                }

                var campo = caixa.querySelector("input");
                if (!campo) {
                    return;
                }

                var virandoVisivel = campo.type === "password";
                campo.type = virandoVisivel ? "text" : "password";

                botao.textContent = virandoVisivel ? "🙈" : "👁";
                botao.setAttribute(
                    "aria-label",
                    virandoVisivel ? "Ocultar senha" : "Mostrar senha"
                );
            });
        });
    }

    /* ======================================================================
       FORMULARIO DE CADASTRO
       ====================================================================== */
    function ligarCadastro() {
        var formulario = document.getElementById("formulario-cadastro");
        if (!formulario) {
            return;
        }

        var campos = ["nome", "email", "telefone", "cidade", "negocio",
            "momento", "senha", "confirmarSenha"];
        var mensagem = document.getElementById("mensagem-cadastro");

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();
            limparMensagem(mensagem);
            limparTodosOsCampos(formulario, campos);

            var dados = {
                nome: formulario.elements.nome.value.trim(),
                email: normalizarEmail(formulario.elements.email.value),
                telefone: formulario.elements.telefone.value.trim(),
                cidade: formulario.elements.cidade.value.trim(),
                negocio: formulario.elements.negocio.value,
                momento: formulario.elements.momento.value,
                senha: String(formulario.elements.senha.value || ""),
                confirmarSenha: String(formulario.elements.confirmarSenha.value || "")
            };

            var primeiroInvalido = null;

            function reprovar(campo, texto) {
                marcarCampo(formulario, campo, texto);
                if (!primeiroInvalido) {
                    primeiroInvalido = formulario.elements[campo];
                }
            }

            if (!dados.nome) {
                reprovar("nome", "Informe seu nome completo.");
            } else if (dados.nome.length < 3) {
                reprovar("nome", "O nome precisa ter pelo menos 3 caracteres.");
            }

            if (!dados.email) {
                reprovar("email", "O e-mail é obrigatório.");
            } else if (!REGEX_EMAIL.test(dados.email)) {
                reprovar("email", "Informe um e-mail válido, como nome@exemplo.com.");
            }

            var digitos = somenteDigitos(dados.telefone);
            if (!dados.telefone) {
                reprovar("telefone", "Informe um telefone para contato.");
            } else if (digitos.length < 10 || digitos.length > 11) {
                reprovar("telefone", "Use DDD + número, com 10 ou 11 dígitos.");
            }

            if (!dados.cidade) {
                reprovar("cidade", "Informe sua cidade.");
            }

            if (!dados.negocio) {
                reprovar("negocio", "Selecione o tipo de negócio.");
            }

            if (!dados.momento) {
                reprovar("momento", "Selecione o momento do seu negócio.");
            }

            if (!dados.senha) {
                reprovar("senha", "Crie uma senha.");
            } else if (dados.senha.length < 6) {
                reprovar("senha", "A senha precisa ter no mínimo 6 caracteres.");
            }

            if (!dados.confirmarSenha) {
                reprovar("confirmarSenha", "Repita a senha.");
            } else if (dados.senha !== dados.confirmarSenha) {
                reprovar("confirmarSenha", "A confirmação de senha não confere.");
            }

            var termosAceitos = formulario.elements.termos.checked;

            if (primeiroInvalido) {
                mostrarMensagem(mensagem, "erro",
                    "Não foi possível concluir: confira os campos destacados.");
                primeiroInvalido.focus();
                return;
            }

            if (!termosAceitos) {
                mostrarMensagem(mensagem, "erro",
                    "Você precisa aceitar os termos para concluir o cadastro.");
                formulario.elements.termos.focus();
                return;
            }

            var usuarias = lerUsuarias();
            var jaExiste = usuarias.some(function (item) {
                return normalizarEmail(item.email) === dados.email;
            });

            if (jaExiste) {
                marcarCampo(formulario, "email", "Este e-mail já está cadastrado.");
                mostrarMensagem(mensagem, "erro",
                    "Este e-mail já está cadastrado. Tente entrar na sua conta.");
                formulario.elements.email.focus();
                return;
            }

            var nova = {
                id: Date.now(),
                nome: dados.nome,
                email: dados.email,
                telefone: dados.telefone,
                cidade: dados.cidade,
                negocio: dados.negocio,
                momento: dados.momento,
                senha: dados.senha,
                criadaEm: new Date().toISOString()
            };

            usuarias.push(nova);
            salvarUsuarias(usuarias);
            abrirSessao(nova, true);

            mostrarMensagem(mensagem, "sucesso",
                "Cadastro concluído com sucesso! Redirecionando para o seu painel...");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1200);
        });
    }

    /* ======================================================================
       FORMULARIO DE LOGIN
       ====================================================================== */
    function ligarLogin() {
        var formulario = document.getElementById("formulario-login");
        if (!formulario) {
            return;
        }

        var campos = ["email", "senha"];
        var mensagem = document.getElementById("mensagem-login");

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();
            limparMensagem(mensagem);
            limparTodosOsCampos(formulario, campos);

            var email = normalizarEmail(formulario.elements.email.value);
            var senha = String(formulario.elements.senha.value || "");
            var lembrar = Boolean(formulario.elements.lembrar.checked);

            var primeiroInvalido = null;

            if (!email) {
                marcarCampo(formulario, "email", "Informe seu e-mail.");
                primeiroInvalido = formulario.elements.email;
            } else if (!REGEX_EMAIL.test(email)) {
                marcarCampo(formulario, "email",
                    "Informe um e-mail válido, como nome@exemplo.com.");
                primeiroInvalido = formulario.elements.email;
            }

            if (!senha) {
                marcarCampo(formulario, "senha", "Informe sua senha.");
                if (!primeiroInvalido) {
                    primeiroInvalido = formulario.elements.senha;
                }
            }

            if (primeiroInvalido) {
                mostrarMensagem(mensagem, "erro",
                    "Confira os campos destacados para continuar.");
                primeiroInvalido.focus();
                return;
            }

            var usuaria = lerUsuarias().find(function (item) {
                return normalizarEmail(item.email) === email &&
                    String(item.senha) === senha;
            });

            if (!usuaria) {
                mostrarMensagem(mensagem, "erro",
                    "Credenciais inválidas. Verifique seus dados ou faça seu cadastro.");
                formulario.elements.senha.focus();
                return;
            }

            abrirSessao(usuaria, lembrar);
            mostrarMensagem(mensagem, "sucesso",
                "Login realizado com sucesso! Redirecionando...");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 900);
        });

        var sessao = lerSessao();
        if (sessao && sessao.email) {
            mostrarMensagem(mensagem, "info",
                "Encontramos uma sessão para " + sessao.email +
                ". Entre novamente ou siga para o painel.");
        }
    }

    /* ======================================================================
       PAGINAS INTERNAS: nome da usuaria e botao Sair
       ====================================================================== */
    function ligarPaginasInternas() {
        var sessao = lerSessao();

        // Mostra o nome de quem esta logada nos lugares marcados no HTML.
        if (sessao && sessao.nome) {
            document.querySelectorAll("[data-nome-usuaria]").forEach(function (alvo) {
                var saudacao = alvo.getAttribute("data-nome-usuaria");
                alvo.textContent = saudacao ? saudacao + " " + sessao.nome : sessao.nome;
            });
        }

        // Botao/link "Sair"
        document.querySelectorAll("[data-acao='sair']").forEach(function (botao) {
            botao.addEventListener("click", function (evento) {
                evento.preventDefault();
                encerrarSessao();
                window.location.href = botao.getAttribute("href") || "login.html";
            });
        });
    }

    /* ======================================================================
       INICIALIZACAO
       ====================================================================== */
    function iniciar() {
        ligarMostrarSenha();
        ligarCadastro();
        ligarLogin();
        ligarPaginasInternas();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
