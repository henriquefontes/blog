export default function extractMarkdownFrontMatter(markdownContent) {
  const frontMatter = {};
  const endOfFrontMatter = markdownContent.indexOf("---", 3);
  const containsFrontMatter =
    markdownContent.startsWith("---") && endOfFrontMatter !== -1;

  if (containsFrontMatter) {
    const frontMatterContent = markdownContent
      .slice(3, endOfFrontMatter)
      .trim();
    const lines = frontMatterContent.split("\n");

    lines.forEach((line) => {
      const key = line.split(":")[0].trim();
      let value = line.split(":")[1].trim();

      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim());
      }

      frontMatter[key] = value;
    });
  }

  return frontMatter;
}
