/* ==========================================================================
   FAQ.JS - Interacao adicional: acordeao de perguntas frequentes
   Usado na secao "Perguntas Frequentes" da pagina inicial.
   Abre uma pergunta por vez e mantem aria-expanded/hidden em dia para
   funcionar tambem com teclado e leitor de tela.
   ========================================================================== */

(function () {
    "use strict";

    function iniciar() {
        var perguntas = document.querySelectorAll(".pergunta-faq");
        if (!perguntas.length) {
            return;
        }

        function fecharTodas() {
            perguntas.forEach(function (pergunta) {
                pergunta.setAttribute("aria-expanded", "false");

                var resposta = document.getElementById(
                    pergunta.getAttribute("aria-controls")
                );
                if (resposta) {
                    resposta.hidden = true;
                }
            });
        }

        // Garante o estado inicial fechado, mesmo se o HTML vier diferente.
        fecharTodas();

        perguntas.forEach(function (pergunta) {
            pergunta.addEventListener("click", function () {
                var jaEstavaAberta = pergunta.getAttribute("aria-expanded") === "true";

                fecharTodas();

                if (!jaEstavaAberta) {
                    pergunta.setAttribute("aria-expanded", "true");

                    var resposta = document.getElementById(
                        pergunta.getAttribute("aria-controls")
                    );
                    if (resposta) {
                        resposta.hidden = false;
                    }
                }
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
