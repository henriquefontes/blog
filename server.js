import express from "express";
import fs from "fs/promises";
import path from "path";
import { marked } from "marked";

import extractMarkdownData from "./utils/markdown/extractMarkdownData.js";
import getAllPosts from "./utils/posts/getAllPosts.js";
import formatDate from "./utils/date/formatDate.js";
import getMonthName from "./utils/date/getMonthName.js";

const posts = (await getAllPosts())
  .filter((post) => post.date instanceof Date)
  .sort((a, b) => b.date - a.date);

const postsByMonth = posts.reduce((acc, post) => {
  const year = post.date?.getFullYear();
  const month = post.date?.getMonth();
  const monthName = getMonthName(month, year);

  (acc[monthName] ||= []).push(post);
  return acc;
}, {});

const postsByTag = posts.reduce((acc, post) => {
  if (!Array.isArray(post.tags)) return acc;

  const year = post.date?.getFullYear();
  const month = post.date?.getMonth();
  const monthName = getMonthName(month, year);

  for (const tag of post.tags) {
    const tagGroup = (acc[tag] ||= {});
    (tagGroup[monthName] ||= []).push(post);
  }

  return acc;
}, {});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(process.cwd(), "public")));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views/pages"));

app.get("/", (req, res) => {
  res.render("index", { postsByMonth });
});

app.get("/tags/:tag", (req, res) => {
  const { tag } = req.params;
  const posts = postsByTag[tag] || {};

  res.render("tag", { tag, postsByMonth: posts });
});

app.get("/*path", async (req, res) => {
  try {
    const markdownPath = path.join(process.cwd(), "posts", ...req.params.path);

    const markdownContent = await fs.readFile(`${markdownPath}.md`, "utf-8");

    const { frontMatter, content } = extractMarkdownData(markdownContent);

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
