import extractMarkdownFrontMatter from "./extractMarkdownFrontMatter.js";

export default function extractMarkdownData(markdownContent) {
  const frontMatter = extractMarkdownFrontMatter(markdownContent);
  const containsFrontMatter =
    markdownContent.startsWith("---") &&
    markdownContent.indexOf("---", 3) != -1;

  const content = containsFrontMatter
    ? markdownContent.slice(markdownContent.indexOf("---", 3) + 3).trim()
    : markdownContent.trim();

  return { frontMatter, content };
}
