import fs from "fs/promises";
import path from "path";
import extractMarkdownFrontMatter from "../markdown/extractMarkdownFrontMatter.js";

export default async function getAllPosts() {
  const POSTS_FOLDER = "/posts";
  const POSTS_DIR = process.cwd() + POSTS_FOLDER;
  const postsFiles = await fs.readdir(POSTS_DIR, {
    recursive: true,
    withFileTypes: true,
  });

  const posts = await Promise.all(
    postsFiles
      .filter((file) => file.isFile() && file.name.endsWith(".md"))
      .map(async (file) => {
        const fileDir = path.join(file.parentPath, file.name);
        const fileContent = await fs.readFile(fileDir, "utf-8");
        const frontMatter = extractMarkdownFrontMatter(fileContent);

        return {
          ...frontMatter,
          path: fileDir
            .replaceAll("\\", "/")
            .replace(POSTS_DIR.replaceAll("\\", "/"), "")
            .replace(POSTS_FOLDER, "")
            .replace(".md", ""),
        };
      })
  );

  return posts;
}
