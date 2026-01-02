import express from "express";
import fs from "fs/promises";
import path from "path";
import { marked } from "marked";

import extractMarkdownData from "./utils/markdown/extractMarkdownData.js";
import getAllPosts from "./utils/posts/getAllPosts.js";
import formatDate from "./utils/posts/formatDate.js";

const posts = (await getAllPosts()).sort((a, b) => b.date - a.date);
const postsByTag = posts.reduce((acc, post) => {
  for (const tag of post.tags) {
    const posts = acc[tag] || (acc[tag] = []);

    posts.push(post);
  }
  return acc;
}, {});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(process.cwd(), "public")));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views/pages"));

app.get("/tags/:tag", (req, res) => {
  const tag = req.params.tag;
  const posts = postsByTag[tag] || [];

  res.render("tag", { tag, posts });
});

app.get("/*path", async (req, res) => {
  try {
    const markdownPath = req.params.path.join("/");
    const markdownData = await fs.readFile(
      process.cwd() + `/posts/${markdownPath}.md`,
      "utf-8"
    );
    const { frontMatter, content } = extractMarkdownData(markdownData);
    const htmlContent = marked.parse(content);

    frontMatter.date = formatDate(frontMatter.date);

    res.render("post", {
      frontMatter,
      content: htmlContent,
      identifier: markdownPath,
    });
  } catch (error) {
    console.log(error);

    res.status(404).render("error");
  }
});

app.get("/", (req, res) => {
  res.render("index", { posts });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
