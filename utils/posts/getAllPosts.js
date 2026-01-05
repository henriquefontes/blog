import fs from "fs/promises";
import path from "path";
import extractMarkdownFrontMatter from "../markdown/extractMarkdownFrontMatter.js";

const POSTS_DIR = path.join(process.cwd(), "posts");

/**
 * Return an array containing all posts objects, using files included in posts folder.
 *
 * @returns {[{ frontMatter: object, path: string }]} posts
 */
export default async function getAllPosts() {
  const files = await fs.readdir(POSTS_DIR, {
    recursive: true,
    withFileTypes: true,
  });

  const markdownFiles = files.filter(
    (file) => file.isFile() && file.name.endsWith(".md")
  );

  const posts = [];

  for (const file of markdownFiles) {
    const absolutePath = path.join(file.parentPath, file.name);
    const content = await fs.readFile(absolutePath, "utf-8");

    const frontMatter = extractMarkdownFrontMatter(content);

    const relativePath = absolutePath
      .replace(POSTS_DIR, "")
      .replaceAll("\\", "/")
      .replace(".md", "");

    posts.push({
      ...frontMatter,
      path: relativePath,
    });
  }

  return posts;
}
