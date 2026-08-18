/* ==========================================================================
   TEMA.JS - Interacao adicional: alternancia de tema claro/escuro
   Carregado em TODAS as paginas, no <head> e SEM "defer".
   Motivo: a classe precisa entrar na tag <html> antes da pagina ser pintada,
   senao o tema escuro "pisca" claro a cada troca de pagina.
   ========================================================================== */

(function () {
    "use strict";

    var CHAVE = "empreendaTema";
    var CLASSE_ESCURO = "tema-escuro";

    /* ----------------------------------------------------------------------
       1. Aplica o tema salvo imediatamente (antes do <body> existir)
       ---------------------------------------------------------------------- */
    function lerTemaSalvo() {
        try {
            return localStorage.getItem(CHAVE);
        } catch (erro) {
            // Navegacao anonima pode bloquear o localStorage: seguimos no claro.
            return null;
        }
    }

    function salvarTema(tema) {
        try {
            localStorage.setItem(CHAVE, tema);
        } catch (erro) {
            console.warn("Nao foi possivel salvar a preferencia de tema.");
        }
    }

    var temaSalvo = lerTemaSalvo();

    // Se a usuaria nunca escolheu, respeita a preferencia do sistema operacional.
    var prefereEscuro = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    var comecarEscuro = temaSalvo === "escuro" || (temaSalvo === null && prefereEscuro);

    if (comecarEscuro) {
        document.documentElement.classList.add(CLASSE_ESCURO);
    }

    /* ----------------------------------------------------------------------
       2. Liga o botao quando o HTML terminar de carregar
       ---------------------------------------------------------------------- */
    function estaEscuro() {
        return document.documentElement.classList.contains(CLASSE_ESCURO);
    }

    function atualizarBotao(botao) {
        var escuro = estaEscuro();
        var icone = botao.querySelector(".icone-tema");
        var texto = botao.querySelector(".texto-tema");

        if (icone) {
            icone.textContent = escuro ? "☀️" : "🌙";
        }
        if (texto) {
            texto.textContent = escuro ? "Tema claro" : "Tema escuro";
        }

        botao.setAttribute("aria-pressed", escuro ? "true" : "false");
        botao.setAttribute(
            "aria-label",
            escuro ? "Mudar para o tema claro" : "Mudar para o tema escuro"
        );
    }

    function iniciar() {
        var botoes = document.querySelectorAll(".botao-tema");

        botoes.forEach(function (botao) {
            atualizarBotao(botao);

            botao.addEventListener("click", function () {
                document.documentElement.classList.toggle(CLASSE_ESCURO);
                salvarTema(estaEscuro() ? "escuro" : "claro");

                // Atualiza todos os botoes da pagina, nao so o que foi clicado.
                document.querySelectorAll(".botao-tema").forEach(atualizarBotao);
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
