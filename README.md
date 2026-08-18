# Empreenda Mais Elas

Projeto da disciplina **Desenvolvimento para Web**.

**Professor:** Jayr Alencar Pereira

**Integrantes:**

- José Railson Leite da Silva
- José Junio de Souza Matias
- Marcos Felipe Ferreira Duarte

## Sobre o projeto
modelagem
Plataforma de apoio ao empreendedorismo feminino. A interface reúne trilhas de
aprendizagem, mentorias, uma ferramenta de diagnóstico de negócio e um
marketplace comunitário para empreendedoras.

O projeto é totalmente estático (HTML, CSS e JavaScript, sem framework e sem
servidor). Os dados de cadastro e login são simulados com `localStorage`,
apenas para fins didáticos.

## Como executar

Basta abrir o arquivo `index.html` no navegador.

Se preferir usar um servidor local (recomendado, para evitar restrições do
protocolo `file://`):

```bash
# com Python 3
python3 -m http.server 8000

# depois acesse http://localhost:8000
```

No VS Code, a extensão **Live Server** também funciona: clique com o botão
direito em `index.html` e escolha *Open with Live Server*.

## Estrutura de pastas

```
.
├── index.html                    página inicial (formulário de contato e FAQ)
├── css/
│   ├── base.css                  tokens de cor, reset, tema claro/escuro,
│   │                             botões e formulários (usado em TODAS as páginas)
│   ├── home.css                  estilos exclusivos da página inicial
│   ├── painel.css                layout das 7 páginas internas
│   └── auth.css                  páginas de login e cadastro
├── js/
│   ├── tema.js                   alternância de tema claro/escuro (todas as páginas)
│   ├── contato.js                validação do formulário de contato
│   ├── faq.js                    acordeão de perguntas frequentes
│   ├── auth.js                   cadastro, login e sessão
│   ├── diagnostico.js            questionário de diagnóstico
│   ├── marketplace.js            busca e filtro de produtos
│   └── mentorias.js              modal de agendamento de mentoria
├── img/                          15 imagens em SVG (logo, ícones, avatares,
│                                 ilustrações e fotos de produto)
└── paginas/
    ├── dashboard.html            painel inicial da empreendedora
    ├── diagnostico.html          questionário de 5 perguntas
    ├── trilhas.html              trilhas de aprendizagem
    ├── mentorias.html            agendamento com especialistas
    ├── marketplace.html          vitrine de produtos
    ├── painelempreendedora.html  painel comercial da loja
    ├── paineladministrativo.html painel de aprovações
    ├── login.html                acesso à conta
    └── register.html             criação de conta
```

## Etapa final: formulário e JavaScript

### Formulário de contato

Fica na página inicial, na seção **"Fale com a nossa equipe"** (`index.html`).
Possui 5 campos, todos com `<label>` associado:

| Campo | Tipo | Validação |
|---|---|---|
| Nome completo | texto | obrigatório, mínimo 3 caracteres, precisa conter letras |
| E-mail | e-mail | obrigatório, formato `nome@dominio.ext` |
| Área de interesse | seleção | obrigatório |
| Telefone | telefone | obrigatório, DDD + número (10 ou 11 dígitos) |
| Mensagem | área de texto | obrigatório, mínimo 10 caracteres |

A validação é feita em `js/contato.js`. O formulário usa `novalidate` para que
a verificação seja inteiramente do JavaScript, como pede a atividade. Cada erro
aparece abaixo do campo correspondente, o campo fica destacado em vermelho, o
foco vai para o primeiro campo inválido e uma mensagem geral de erro ou de
sucesso é exibida acima do botão.

### Interações adicionais com JavaScript

1. **Tema claro/escuro** (`js/tema.js`) — funciona em **todas as 10 páginas**,
   guarda a preferência no navegador e respeita a configuração do sistema
   operacional na primeira visita.
2. **Acordeão de perguntas frequentes** (`js/faq.js`) — página inicial.
3. **Questionário de diagnóstico** (`js/diagnostico.js`) — 5 perguntas com
   avanço, retorno, barra de progresso e resultado calculado por pontuação.
4. **Busca no marketplace** (`js/marketplace.js`) — filtra produtos por nome,
   vendedora e categoria, ignorando acentos e maiúsculas.
5. **Modal de agendamento** (`js/mentorias.js`) — abre uma janela `<dialog>`
   com formulário validado para marcar a mentoria.
6. **Mostrar/ocultar senha** (`js/auth.js`) — login e cadastro.

## Acessibilidade e boas práticas

- HTML semântico em todas as páginas: `header`, `nav`, `main`, `section`,
  `article`, `aside` e `footer`.
- Link "Pular para o conteúdo" no início de cada página.
- `aria-current="page"` marca o item de menu da página atual.
- Todas as imagens têm `alt`; as decorativas usam `alt=""`.
- Mensagens de erro com `role="alert"` e status com `aria-live="polite"`.
- Layout responsivo, testado em 360px, 768px, 900px e 1280px.
