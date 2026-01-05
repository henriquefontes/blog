import express from "express";
import fs from "fs/promises";
import path from "path";
import { marked } from "marked";

import extractMarkdownData from "./utils/markdown/extractMarkdownData.js";
import getAllPosts from "./utils/posts/getAllPosts.js";
import formatDate from "./utils/date/formatDate.js";

/*
|--------------------------------------------------------------------------
| Preparação de dados (executado uma vez na inicialização)
|--------------------------------------------------------------------------
*/

const posts = (await getAllPosts())
  .filter((post) => post.date instanceof Date)
  .sort((a, b) => b.date - a.date);

/**
 * Extrai o label de mês/ano no formato MM-YYYY a partir de uma Date.
 * Centralizar essa lógica evita duplicação e inconsistências.
 */
function getMonthLabel(date) {
  const month = String(date.getMonth()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${year}`;
}

/**
 * Agrupa posts por mês/ano.
 * Retorna um objeto tp assim:
 * {
 *   "01-2025": [post, post]
 * }
 */
const postsByMonth = Object.entries(
  posts.reduce((acc, post) => {
    const label = getMonthLabel(post.date);
    (acc[label] ||= []).push(post);
    return acc;
  }, {})
)
  .sort(([a], [b]) => b.localeCompare(a))
  .map(([iso, posts]) => {
    const [month, year] = iso.split("-");
    const date = new Date(year, month);

    return {
      iso,
      label: new Intl.DateTimeFormat("pt-BR", {
        year: "numeric",
        month: "long",
      }).format(date),
      posts,
    };
  });

/**
 * Agrupa posts por tag e, dentro de cada tag, por mês/ano.
 * {
 *   javascript: {
 *     "01-2025": [post]
 *   }
 * }
 */
const postsByTag = posts.reduce((acc, post) => {
  if (!Array.isArray(post.tags)) return acc;

  const label = getMonthLabel(post.date);

  for (const tag of post.tags) {
    const tagGroup = acc[tag] ||= {};
    (tagGroup[label] ||= []).push(post);
  }

  return acc;
}, {});

/*
|--------------------------------------------------------------------------
| Inicialização do servidor
|--------------------------------------------------------------------------
*/

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(process.cwd(), "public")));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views/pages"));

/*
|--------------------------------------------------------------------------
| Rotas
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.render("index", { postsByMonth });
});

app.get("/tags/:tag", (req, res) => {
  const { tag } = req.params;
  const posts = postsByTag[tag] || {};

  res.render("tag", { tag, postsByMonth: posts });
});

/*
|--------------------------------------------------------------------------
| Rota de post individual
|--------------------------------------------------------------------------
| captura qualquer path e tenta resolver como markdown dentro de /posts.
| qualquer erro cai na página 404.
*/

app.get("/*path", async (req, res) => {
  try {
    const markdownPath = path.join(
      process.cwd(),
      "posts",
      ...req.params.path
    );

    const markdownContent = await fs.readFile(`${markdownPath}.md`, "utf-8");

    const { frontMatter, content } =
      extractMarkdownData(markdownContent);

    const htmlContent = marked.parse(content);

    res.render("post", {
      frontMatter: {
        ...frontMatter,
        date: formatDate(frontMatter.date),
      },
      content: htmlContent,
      identifier: req.params.path.join("/"),
    });
  } catch (error) {
    console.error(error);
    res.status(404).render("error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
