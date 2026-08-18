/* ==========================================================================
   DIAGNOSTICO.JS - Interacao adicional: questionario de diagnostico
   Antes a pagina mostrava "Pergunta 3 de 5" fixa, com opcoes feitas de <div>
   e botoes "Voltar"/"Avancar" que nao faziam nada.
   Agora o questionario avanca, volta, valida a resposta e mostra o resultado.
   ========================================================================== */

(function () {
    "use strict";

    /* ----------------------------------------------------------------------
       Perguntas
       ---------------------------------------------------------------------- */
    var PERGUNTAS = [
        {
            titulo: "Em que momento o seu negócio está hoje?",
            opcoes: [
                { texto: "Estou estruturando uma ideia para começar do zero", pontos: 1 },
                { texto: "Já vendo de vez em quando, sem constância", pontos: 2 },
                { texto: "Já tenho um negócio ativo e quero expandir", pontos: 3 }
            ]
        },
        {
            titulo: "Você separa as contas pessoais das contas do negócio?",
            opcoes: [
                { texto: "Não, uso a mesma conta para tudo", pontos: 1 },
                { texto: "Separo em parte, mas ainda me confundo", pontos: 2 },
                { texto: "Sim, tenho controle separado", pontos: 3 }
            ]
        },
        {
            titulo: "Como você calcula o preço dos seus produtos ou serviços?",
            opcoes: [
                { texto: "Olho o preço das outras pessoas e copio", pontos: 1 },
                { texto: "Somo os custos e acrescento um valor", pontos: 2 },
                { texto: "Calculo custos, despesas fixas e margem de lucro", pontos: 3 }
            ]
        },
        {
            titulo: "Como você divulga o seu negócio?",
            opcoes: [
                { texto: "Só no boca a boca", pontos: 1 },
                { texto: "Publico nas redes sociais quando lembro", pontos: 2 },
                { texto: "Tenho uma rotina de divulgação e acompanho resultados", pontos: 3 }
            ]
        },
        {
            titulo: "Qual é a sua maior dificuldade neste momento?",
            opcoes: [
                { texto: "Organizar a rotina e definir metas", pontos: 1 },
                { texto: "Controlar o dinheiro e precificar", pontos: 2 },
                { texto: "Vender mais e alcançar novos clientes", pontos: 3 }
            ]
        }
    ];

    /* ----------------------------------------------------------------------
       Resultados possiveis
       ---------------------------------------------------------------------- */
    function montarResultado(pontos) {
        if (pontos <= 7) {
            return {
                titulo: "Fase de ideia",
                texto: "Você está no comecinho, e esse é o melhor momento para " +
                    "construir uma base sólida. Sugerimos começar pela trilha de " +
                    "Mentalidade Empreendedora e Gestão de Tempo.",
                trilha: "trilhas.html"
            };
        }
        if (pontos <= 11) {
            return {
                titulo: "Fase de estruturação",
                texto: "Seu negócio já acontece, mas ainda falta organização " +
                    "financeira. A trilha de Finanças Básicas e Precificação vai " +
                    "te ajudar a enxergar o lucro real.",
                trilha: "trilhas.html"
            };
        }
        return {
            titulo: "Fase de crescimento",
            texto: "Você já tem constância e controle. O próximo passo é escalar: " +
                "recomendamos agendar uma mentoria de Marketing Digital e Vendas.",
            trilha: "mentorias.html"
        };
    }

    /* ----------------------------------------------------------------------
       Elementos da pagina
       ---------------------------------------------------------------------- */
    var caixa = document.getElementById("quiz-diagnostico");
    if (!caixa) {
        return;
    }

    var etapa = document.getElementById("quiz-etapa");
    var enunciado = document.getElementById("quiz-pergunta");
    var grupo = document.getElementById("quiz-opcoes");
    var aviso = document.getElementById("quiz-aviso");
    var botaoVoltar = document.getElementById("quiz-voltar");
    var botaoAvancar = document.getElementById("quiz-avancar");
    var progresso = document.getElementById("quiz-progresso");
    var painelResultado = document.getElementById("quiz-resultado");

    var indiceAtual = 0;
    var respostas = [];

    /* ----------------------------------------------------------------------
       Desenha a pergunta atual
       ---------------------------------------------------------------------- */
    function desenharPergunta() {
        var pergunta = PERGUNTAS[indiceAtual];

        etapa.textContent = "Pergunta " + (indiceAtual + 1) + " de " + PERGUNTAS.length;
        enunciado.textContent = pergunta.titulo;
        aviso.textContent = "";

        if (progresso) {
            progresso.style.width =
                Math.round((indiceAtual / PERGUNTAS.length) * 100) + "%";
        }

        grupo.innerHTML = "";

        pergunta.opcoes.forEach(function (opcao, indice) {
            var rotulo = document.createElement("label");
            rotulo.className = "opcao";

            var entrada = document.createElement("input");
            entrada.type = "radio";
            entrada.name = "pergunta-" + indiceAtual;
            entrada.value = String(opcao.pontos);
            entrada.checked = respostas[indiceAtual] === indice;

            entrada.addEventListener("change", function () {
                respostas[indiceAtual] = indice;
                aviso.textContent = "";
            });

            var texto = document.createElement("span");
            texto.textContent = opcao.texto;

            rotulo.appendChild(entrada);
            rotulo.appendChild(texto);
            grupo.appendChild(rotulo);
        });

        botaoVoltar.disabled = indiceAtual === 0;
        botaoAvancar.textContent =
            indiceAtual === PERGUNTAS.length - 1 ? "Ver resultado" : "Avançar";
    }

    /* ----------------------------------------------------------------------
       Resultado final
       ---------------------------------------------------------------------- */
    function mostrarResultado() {
        var total = respostas.reduce(function (soma, indiceEscolhido, indicePergunta) {
            return soma + PERGUNTAS[indicePergunta].opcoes[indiceEscolhido].pontos;
        }, 0);

        var resultado = montarResultado(total);

        caixa.hidden = true;
        painelResultado.hidden = false;

        painelResultado.innerHTML =
            '<p class="etapa-quiz">Diagnóstico concluído</p>' +
            '<h2 class="pergunta-quiz">' + resultado.titulo + "</h2>" +
            "<p>" + resultado.texto + "</p>" +
            '<p><strong>Sua pontuação: ' + total + " de " + (PERGUNTAS.length * 3) +
            "</strong></p>" +
            '<div class="acoes-quiz">' +
            '<button type="button" class="botao-secundario" id="quiz-refazer">Refazer diagnóstico</button>' +
            '<a class="botao-principal" href="' + resultado.trilha + '">Ver recomendação</a>' +
            "</div>";

        painelResultado.focus();

        document.getElementById("quiz-refazer").addEventListener("click", function () {
            indiceAtual = 0;
            respostas = [];
            painelResultado.hidden = true;
            caixa.hidden = false;
            desenharPergunta();
            caixa.scrollIntoView({ block: "start" });
        });
    }

    /* ----------------------------------------------------------------------
       Navegacao
       ---------------------------------------------------------------------- */
    botaoAvancar.addEventListener("click", function () {
        if (respostas[indiceAtual] === undefined) {
            aviso.textContent = "Escolha uma opção para continuar.";
            return;
        }

        if (indiceAtual === PERGUNTAS.length - 1) {
            mostrarResultado();
            return;
        }

        indiceAtual += 1;
        desenharPergunta();
    });

    botaoVoltar.addEventListener("click", function () {
        if (indiceAtual > 0) {
            indiceAtual -= 1;
            desenharPergunta();
        }
    });

    desenharPergunta();
})();
