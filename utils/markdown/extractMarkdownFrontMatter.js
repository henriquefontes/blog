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
      const key = line.substring(0, line.indexOf(":")).trim();
      let value = line.substring(line.indexOf(":") + 1, line.length).trim();

      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim());
      }

      if (key === "date") value = value ? new Date(value) : null;

      frontMatter[key] = value;
    });
  }

  return frontMatter;
}
