/* ==========================================================================
   CONTATO.JS - Validacao do formulario de contato da pagina inicial
   (antes: js/script.js, que tambem cuidava do tema - agora separado)

   Corrige em relacao a versao anterior:
   - o campo telefone passa a ser validado de verdade (antes o <small> de erro
     existia no HTML mas nunca era usado);
   - a mensagem de sucesso e limpa quando a usuaria volta a digitar;
   - o foco vai para o primeiro campo invalido;
   - marca aria-invalid nos campos com erro, para leitores de tela.
   ========================================================================== */

(function () {
    "use strict";

    var formulario = document.getElementById("formulario-contato");
    if (!formulario) {
        return;
    }

    var status = document.getElementById("status-formulario");

    /* ----------------------------------------------------------------------
       Regras de cada campo
       ---------------------------------------------------------------------- */
    var regras = [
        {
            id: "nome",
            validar: function (valor) {
                if (!valor) {
                    return "Por favor, informe seu nome completo.";
                }
                if (valor.length < 3) {
                    return "O nome precisa ter pelo menos 3 caracteres.";
                }
                if (!/[A-Za-zÀ-ÿ]/.test(valor)) {
                    return "Informe um nome válido, com letras.";
                }
                return "";
            }
        },
        {
            id: "email",
            validar: function (valor) {
                if (!valor) {
                    return "O e-mail é obrigatório.";
                }
                // Formato minimo: algo@algo.algo, sem espacos
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
                    return "Informe um e-mail válido, como nome@exemplo.com.";
                }
                return "";
            }
        },
        {
            id: "interesse",
            validar: function (valor) {
                return valor ? "" : "Selecione uma área de interesse.";
            }
        },
        {
            id: "telefone",
            validar: function (valor) {
                if (!valor) {
                    return "Informe um telefone para contato.";
                }
                // Conta apenas os digitos: aceita (88) 99999-9999, 88999999999 etc.
                var digitos = valor.replace(/\D/g, "");
                if (digitos.length < 10 || digitos.length > 11) {
                    return "O telefone deve ter DDD + número, com 10 ou 11 dígitos.";
                }
                return "";
            }
        },
        {
            id: "mensagem",
            validar: function (valor) {
                if (!valor) {
                    return "Escreva uma mensagem para a nossa equipe.";
                }
                if (valor.length < 10) {
                    return "Conte um pouco mais: use ao menos 10 caracteres.";
                }
                return "";
            }
        }
    ];

    /* ----------------------------------------------------------------------
       Funcoes auxiliares
       ---------------------------------------------------------------------- */
    function campoDe(regra) {
        return document.getElementById(regra.id);
    }

    function erroDe(regra) {
        return document.querySelector('[data-erro-de="' + regra.id + '"]');
    }

    function mostrarErro(regra, mensagem) {
        var campo = campoDe(regra);
        var erro = erroDe(regra);

        campo.classList.add("campo-invalido");
        campo.setAttribute("aria-invalid", "true");
        if (erro) {
            erro.textContent = mensagem;
        }
    }

    function limparErro(regra) {
        var campo = campoDe(regra);
        var erro = erroDe(regra);

        campo.classList.remove("campo-invalido");
        campo.removeAttribute("aria-invalid");
        if (erro) {
            erro.textContent = "";
        }
    }

    function definirStatus(tipo, texto) {
        status.textContent = texto;
        status.className = "mensagem-status" + (tipo ? " is-" + tipo : "");
    }

    function limparStatus() {
        definirStatus("", "");
    }

    /* ----------------------------------------------------------------------
       Valida enquanto a usuaria digita (so limpa o erro, nao incomoda)
       ---------------------------------------------------------------------- */
    regras.forEach(function (regra) {
        var campo = campoDe(regra);
        if (!campo) {
            return;
        }

        // "input" cobre texto e textarea; "change" cobre o <select>.
        ["input", "change"].forEach(function (evento) {
            campo.addEventListener(evento, function () {
                if (!regra.validar(campo.value.trim())) {
                    limparErro(regra);
                }
                // Some com a mensagem de sucesso/erro anterior ao voltar a editar.
                limparStatus();
            });
        });
    });

    /* ----------------------------------------------------------------------
       Envio
       ---------------------------------------------------------------------- */
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        var primeiroInvalido = null;

        regras.forEach(function (regra) {
            var campo = campoDe(regra);
            if (!campo) {
                return;
            }

            var mensagem = regra.validar(campo.value.trim());

            if (mensagem) {
                mostrarErro(regra, mensagem);
                if (!primeiroInvalido) {
                    primeiroInvalido = campo;
                }
            } else {
                limparErro(regra);
            }
        });

        if (primeiroInvalido) {
            definirStatus("erro", "Não foi possível enviar: confira os campos destacados.");
            primeiroInvalido.focus();
            return;
        }

        var nome = document.getElementById("nome").value.trim().split(" ")[0];

        definirStatus(
            "sucesso",
            "Obrigada, " + nome + "! Mensagem enviada com sucesso. " +
            "Nossa equipe responde em até 2 dias úteis."
        );

        formulario.reset();
    });
})();
