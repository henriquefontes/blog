import express from "express";
import fs from "fs/promises";
import { marked } from "marked";

import extractMarkdownData from "./utils/markdown/extractMarkdownData.js";
import getAllPosts from "./utils/posts/getAllPosts.js";

const posts = await getAllPosts();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/*path", async (req, res) => {
  try {
    const path = req.params.path.join("/");
    const markdownData = await fs.readFile(`./posts/${path}.md`, "utf-8");
    const { frontMatter, content } = extractMarkdownData(markdownData);
    const htmlContent = marked.parse(content);

    res.render("post", { frontMatter, content: htmlContent });
  } catch (error) {
    res.status(404).send("Post not found");
  }
});

app.get("/", (req, res) => {
  res.render("index", { posts });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
