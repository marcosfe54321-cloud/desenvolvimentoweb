/* ==========================================================================
   MARKETPLACE.JS - Interacao adicional: busca e filtro de produtos
   Antes o campo de busca existia mas nao filtrava nada.
   Agora filtra por nome do produto, vendedora e categoria, em tempo real.
   ========================================================================== */

(function () {
    "use strict";

    function iniciar() {
        var campoBusca = document.getElementById("busca-produto");
        var filtroCategoria = document.getElementById("filtro-categoria");
        var lista = document.getElementById("lista-produtos");

        if (!campoBusca || !lista) {
            return;
        }

        var produtos = Array.prototype.slice.call(
            lista.querySelectorAll("[data-produto]")
        );
        var semResultado = document.getElementById("sem-resultado");
        var contador = document.getElementById("contador-produtos");

        /* Remove acentos e deixa minusculo, para "acai" achar "açaí" */
        function normalizar(texto) {
            return String(texto || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
        }

        function filtrar() {
            var termo = normalizar(campoBusca.value.trim());
            var categoria = filtroCategoria ? filtroCategoria.value : "";
            var visiveis = 0;

            produtos.forEach(function (produto) {
                var nome = normalizar(produto.getAttribute("data-nome"));
                var vendedora = normalizar(produto.getAttribute("data-vendedora"));
                var categoriaProduto = produto.getAttribute("data-categoria");

                var combinaTermo = !termo ||
                    nome.indexOf(termo) !== -1 ||
                    vendedora.indexOf(termo) !== -1;

                var combinaCategoria = !categoria || categoriaProduto === categoria;

                var mostrar = combinaTermo && combinaCategoria;
                produto.hidden = !mostrar;

                if (mostrar) {
                    visiveis += 1;
                }
            });

            if (semResultado) {
                semResultado.hidden = visiveis > 0;
            }

            if (contador) {
                contador.textContent = visiveis === 1
                    ? "1 produto encontrado"
                    : visiveis + " produtos encontrados";
            }
        }

        campoBusca.addEventListener("input", filtrar);

        if (filtroCategoria) {
            filtroCategoria.addEventListener("change", filtrar);
        }

        // Impede o recarregamento da pagina ao apertar Enter na busca
        var formularioBusca = campoBusca.closest("form");
        if (formularioBusca) {
            formularioBusca.addEventListener("submit", function (evento) {
                evento.preventDefault();
                filtrar();
            });
        }

        filtrar();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
