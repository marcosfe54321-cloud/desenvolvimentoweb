/* ==========================================================================
   MENTORIAS.JS - Interacao adicional: modal de agendamento de mentoria
   Antes os botoes "Agendar" nao faziam nada.
   Agora abrem uma janela modal (<dialog>) com um pequeno formulario de
   agendamento, validado com JavaScript, e confirmam o horario escolhido.
   ========================================================================== */

(function () {
    "use strict";

    function iniciar() {
        var modal = document.getElementById("modal-agendamento");
        if (!modal) {
            return;
        }

        var nomeMentora = document.getElementById("modal-mentora");
        var formulario = document.getElementById("formulario-agendamento");
        var campoData = document.getElementById("agendamento-data");
        var campoHorario = document.getElementById("agendamento-horario");
        var campoAssunto = document.getElementById("agendamento-assunto");
        var status = document.getElementById("status-agendamento");
        var confirmacao = document.getElementById("confirmacao-agendamento");

        var botaoQueAbriu = null;

        /* Impede escolher uma data no passado */
        function hojeISO() {
            var agora = new Date();
            var fuso = agora.getTimezoneOffset() * 60000;
            return new Date(agora - fuso).toISOString().slice(0, 10);
        }

        campoData.min = hojeISO();

        function definirStatus(tipo, texto) {
            status.textContent = texto;
            status.className = "mensagem-status" + (tipo ? " is-" + tipo : "");
        }

        /* ------------------------------------------------------------------
           Abrir
           ------------------------------------------------------------------ */
        document.querySelectorAll("[data-agendar]").forEach(function (botao) {
            botao.addEventListener("click", function () {
                botaoQueAbriu = botao;
                nomeMentora.textContent = botao.getAttribute("data-agendar");

                formulario.reset();
                definirStatus("", "");
                campoData.min = hojeISO();

                modal.showModal();
                campoData.focus();
            });
        });

        /* ------------------------------------------------------------------
           Fechar
           ------------------------------------------------------------------ */
        function fechar() {
            modal.close();
        }

        modal.querySelectorAll("[data-fechar-modal]").forEach(function (botao) {
            botao.addEventListener("click", fechar);
        });

        // Clique fora da caixa fecha o modal
        modal.addEventListener("click", function (evento) {
            if (evento.target === modal) {
                fechar();
            }
        });

        // Devolve o foco para o botao que abriu (a tecla Esc tambem cai aqui)
        modal.addEventListener("close", function () {
            if (botaoQueAbriu) {
                botaoQueAbriu.focus();
            }
        });

        /* ------------------------------------------------------------------
           Confirmar agendamento
           ------------------------------------------------------------------ */
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (!campoData.value) {
                definirStatus("erro", "Escolha uma data para a mentoria.");
                campoData.focus();
                return;
            }

            if (campoData.value < hojeISO()) {
                definirStatus("erro", "A data precisa ser hoje ou uma data futura.");
                campoData.focus();
                return;
            }

            if (!campoHorario.value) {
                definirStatus("erro", "Escolha um horário disponível.");
                campoHorario.focus();
                return;
            }

            if (campoAssunto.value.trim().length < 10) {
                definirStatus("erro", "Descreva o assunto em pelo menos 10 caracteres.");
                campoAssunto.focus();
                return;
            }

            var partes = campoData.value.split("-");
            var dataFormatada = partes[2] + "/" + partes[1] + "/" + partes[0];

            confirmacao.hidden = false;
            confirmacao.textContent =
                "Mentoria com " + nomeMentora.textContent + " solicitada para " +
                dataFormatada + " às " + campoHorario.value +
                ". Você receberá a confirmação por e-mail.";
            confirmacao.className = "mensagem-status is-sucesso";

            fechar();
            confirmacao.scrollIntoView({ block: "center" });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
