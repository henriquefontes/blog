---
title: Como criei esse blog
date: 2026-01-05T15:00:00Z
banner: https://images.unsplash.com/photo-1504691342899-4d92b50853e1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJsb2clMjB3cml0aW5nfGVufDB8fDB8fHww
tags: [javascript, node-js, express, ejs, markdown]
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

O objetivo era bem simples: ter um servidor web que retornaria duas páginas, a página index, onde seriam todos os arquivos markdown criados, e outra para exibir o conteúdo de um artigo selecionado.

Por já ter conhecimento, decidi implementar o servidor usando NodeJS e o framework Express.

A configuração básica inicial considerando as duas páginas ficaria assim:

```javascript
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Rota para o index
app.get("/", (req, res) => {
  res.send();
});

// Rota para a página do artigo
app.get("/*path", async (req, res) => {
  res.send();
});
```
