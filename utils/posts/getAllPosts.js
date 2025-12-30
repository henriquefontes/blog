import fs from "fs/promises";
import path from "path";
import extractMarkdownFrontMatter from "../markdown/extractMarkdownFrontMatter.js";

export default async function getAllPosts() {
  const POSTS_DIR = "posts";
  const postsFiles = await fs.readdir("./" + POSTS_DIR, {
    recursive: true,
    withFileTypes: true,
  });

  const posts = await Promise.all(
    postsFiles
      .filter((file) => file.isFile() && file.name.endsWith(".md"))
      .map(async (file) => {
        const fileDir = path.join(file.parentPath, file.name);
        const fileContent = await fs.readFile(
          path.join(file.parentPath, file.name),
          "utf-8"
        );
        const frontMatter = extractMarkdownFrontMatter(fileContent);

        return {
          ...frontMatter,
          path: fileDir
            .replace(POSTS_DIR, "")
            .replaceAll("\\", "/")
            .replace(".md", ""),
        };
      })
  );

  return posts;
}
