---
title: Como criei esse blog
date: 2026-01-05T15:00:00Z
banner: https://images.unsplash.com/photo-1504691342899-4d92b50853e1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsb2clMjB3cml0aW5nfGVufDB8fDB8fHww
tags: [javascript, node-js, express, ejs, markdown, vercel]
---

Como primeiro artigo, acredito que seria interessante comentar sobre as minhas ideias antes e durante a criação desse blog.

Há muito tempo, eu sentia vontade de escrever sobre o que eu ia aprendendo, pois tinha em mente que seria algo que me ajudaria na compreensão dos conteúdos, por me obrigar a explicá-los com minhas próprias palavras.

Porém, a **procrastinação** me fez estender esse momento, sempre idealizando a **melhor forma** de criar um blog para registrar meus artigos.

Resolvi direcionar minha atenção ao que realmente importa: **escrever**. Assim, decidi ir por um caminho mais simples, que me permitisse subir um blog com rapidez.

## Site estático x dinâmico

Pensei em algumas formas de armazenar e retornar os artigos que iria escrever, como armazenar os textos em um banco de dados e exibir dinamicamente o conteúdo na página.

O problema é que, pensando dessa forma, além de me preocupar com a listagem de artigos, eu teria que considerar a implementação das outras funcionalidades associadas ao _CRUD_, tanto no back-end como no front-end, qual SGBD usar, entre outros detalhes que demandariam tempo...

Enquanto eu lia alguns artigos de documentação no site da Microsoft, percebi que eles eram, basicamente, uma conversão do conteúdo de um arquivo [_markdown_](https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/refs/heads/main/articles/azure-functions/functions-overview.md) para [HTML](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview). Com isso, decidi replicar essa ideia no meu blog, criando um site estático, ao invés de dinâmico.

## "Configuração" do servidor web

O objetivo era bem simples: ter um servidor web que retornaria duas páginas, a página index, onde seriam listados todos os arquivos markdown criados, e outra para exibir o conteúdo de um artigo selecionado.

Eu pensei em usar algum framework de páginas estáticas para isso, como o [Hugo](https://gohugo.io/), mas imaginei que a curva de aprendizado poderia demandar mais tempo do que se eu fizesse algo simples com o que eu já sei.

Por já ter conhecimento, decidi implementar o servidor usando Node.js e o framework Express.

A configuração básica inicial considerando as duas páginas ficaria assim:

```javascript
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Rota para o index
app.get("/", (req, res) => {
  res.send();
});

// Rota para a página de um artigo
app.get("/*path", (req, res) => {
  res.send();
});

app.listen(PORT, () => {
  console.log("Server is running! 🚀");
});
```

## Montagem das páginas

Seguindo a lógica de que vamos montar as páginas server-side, resolvi usar o template engine [EJS](https://ejs.co/) para isso. Com ele, basicamente, é possível montar uma estrutura HTML com dados fornecidos pelo back-end.

Para dizer ao Express que iremos usar o EJS, definimos antes das rotas:

```javascript
// Define o template engine
app.set("view engine", "ejs");
// Define o diretório dos arquivos .ejs
app.set("views", "views");
```

### Index

Para não ter que passar por cada arquivo markdown a cada requisição da página index, optei por ler e armazenar os dados deles em uma lista ao iniciar o servidor web.

Como a quantidade de artigos não será gigantesca, tipo _1 milhão_ 🤯, acredito que não haveria problema com consumo de memória, além de que o artigo não é armazenado inteiramente, apenas o título e o caminho dele na pasta de markdowns.

Com isso, ficamos com a seguinte configuração de rota:

```javascript
// [{ title: 'Post 1', path: "post-1" }, ...]
const posts = await getAllPosts();

app.get("/", (req, res) => {
  res.render("index", { posts });
});
```

No arquivo `index.ejs`, poderíamos, simplesmente, ter a seguinte estrutura:

```html
<ul>
  <% for (const post of posts) { %>
  <li>
    <a href="<%- post.path %>"> <%- post.title %> </a>
  </li>
  <% } %>
</ul>
```

### Artigo

Configurei a rota de um artigo para funcionar com qualquer caminho passado após a `/` da URL.

Através do caminho passado, o servidor busca o markdown correspondente, se não encontrar, retorna a página de `404`.

Como é necessário converter o conteúdo do markdown para HTML, usei a biblioteca [marked.js](https://marked.js.org/).

Além disso, criei uma função utilitária para separar o frontmatter (cabeçalho do markdown) do conteúdo.

Dessa forma, a rota configurada ficou da seguinte forma:

```javascript
import fs from "fs/promises";
import path from "path";
import { marked } from "marked";

app.get("/*path", async (req, res) => {
  try {
    // Caminho do markdown
    const markdownPath = path.join("posts", ...req.params.path);

    // Conteúdo completo do arquivo
    const markdownContent = await fs.readFile(`${markdownPath}.md`, "utf-8");

    // Conteúdo separado
    const { frontMatter, content } = extractMarkdownData(markdownContent);

    // Conteúdo transformado em HTML
    const htmlContent = marked.parse(content);

    res.render("post", { frontMatter, content: htmlContent });
  } catch (error) {
    console.error(error);
    res.status(404).render("error");
  }
});
```

Para o arquivo `post.ejs`, poderíamos ter a seguinte estrutura:

```html
<% if (frontMatter.banner) { %>
<img src="<%- frontMatter.banner %>" alt="" />
<% } %>
<span><%- frontMatter.date %></span>
<h1><%- frontMatter.title %></h1>
<div class="markdown-body" data-theme="light"><%- content %></div>
```

Como o conteúdo transformado em HTML não acompanha nenhuma estilização e para não ter que fazer ela do zero, usei o [github-markdown-css](https://github.com/sindresorhus/github-markdown-css), que contém a quantidade mínima de CSS para replicar a estilização do GitHub aplicada nos arquivos markdown.

Apenas com essas duas páginas, 98% do blog já está feito, restando apenas os outros 2%, que engloba melhorias no layout, estilização e outras funcionalidades, como filtro por tags, modo escuro e [seção de comentários](https://disqus.com), que não irei detalhar nesse artigo.

## Deploy

Usei a plataforma [Vercel](https://vercel.com) para subir o servidor web.

Um benefício da Vercel é que o deploy é feito automaticamente quando um novo commit sobe para a branch configurada. No caso do blog, isso é necessário para atualizar a lista de posts carregadas no start do servidor.

Adicionei o repositório, escolhi a branch main, cliquei em deploy e... como todo primeiro teste de um programador, **não** funcionou.

Abri o console e lá haviam diversas exceções de acesso a diretório, indicando que os arquivos markdown que o código tentava acessar não existiam, mesmo que o caminho passado estivesse correto e que o arquivo existisse.

![Console com erros de arquivo inexistente](https://raw.githubusercontent.com/henriquefontes/blog/refs/heads/main/public/images/c7b91ee7ea5be16e15f068e9d0ae7212.png)

Dei uma lida em um [guia da Vercel](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions) e vi que precisava incluir um detalhe a mais no caminho dos arquivos externos que chamo no código, semelhante ao seguinte código:

```javascript
// Necessário incluir o process.cwd() no caminho, para funcionamento em funções serverless.

// Sem a correção
const markdownPath = path.join("posts", ...req.params.path);

// Com a correção
const markdownPath = path.join(process.cwd(), "posts", ...req.params.path);
```

Além disso, tive que incluir no projeto o `vercel.json`, um arquivo de configurações de deploy, para que o deploy não desconsiderasse os arquivos .ejs no diretório final, pois eu não estava conseguindo incluir meus partials (importações .ejs dentro de outros .ejs). O JSON ficou da seguinte forma:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["views/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

E voilà! Funcionou! Agora é só começar a escrever.

## Contribuições

Caso queira dar uma olhada e, até mesmo, contribuir com alguma correção, feature ou até algum ajuste em artigos, o [repositório está aberto](https://github.com/henriquefontes/blog).

Se desejar, pode também fazer um fork, alterar o nome do blog e usar normalmente.

## Agradecimentos

Agradeço ao Fábio Akita, por [encorajar a escrita de artigos](https://akitaonrails.com/2025/09/10/meu-novo-blog-como-eu-fiz/#o-blog-perfeito-n%c3%a3o-existe), ressaltando a necessidade de priorizar o conteúdo ao invés do desenvolvimento do "blog perfeito".

Agradeço também ao meu amigo [@ThallesDaniel](https://github.com/ThallesDaniel), por ter contribuído com o projeto com boas práticas de código.
