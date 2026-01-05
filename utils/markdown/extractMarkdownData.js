import extractMarkdownFrontMatter from "./extractMarkdownFrontMatter.js";
/**
 * Extrai front matter e conteúdo limpo do markdown
 *
 * @param {string} markdownContent
 * @returns {{ frontMatter: object, content: string }}
 */

export default function extractMarkdownData(markdownContent) {
  if (typeof markdownContent !== "string") {
    throw new TypeError("markdownContent deve ser uma string");
  }

  const frontMatter = extractMarkdownFrontMatter(markdownContent);

  let content = markdownContent;

  if (markdownContent.startsWith("---")) {
    const endIndex = markdownContent.indexOf("---", 3);
    if (endIndex !== -1) {
      content = markdownContent.slice(endIndex + 3);
    }
  }

  return {
    frontMatter,
    content: content.trim(),
  };
}