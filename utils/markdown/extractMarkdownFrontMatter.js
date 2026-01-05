/**
 * Extract frontmatter of a markdown content.
 * Returning a object containing frontmatter keys and values.
 *
 * @param {string} markdownContent
 * @returns {object}
 */

export default function extractMarkdownFrontMatter(markdownContent) {
  const frontMatter = {};

  if (!markdownContent?.startsWith("---")) {
    return frontMatter;
  }

  const endIndex = markdownContent.indexOf("---", 3);
  if (endIndex === -1) {
    return frontMatter;
  }

  const rawFrontMatter = markdownContent.slice(3, endIndex).trim();
  const lines = rawFrontMatter.split("\n");

  for (const line of lines) {
    if (!line.includes(":")) continue;

    const [rawKey, ...rawValue] = line.split(":");
    const key = rawKey.trim();
    let value = rawValue.join(":").trim();

    if (!key) continue;

    // Array: [a, b, c]
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // Date
    if (key === "date") {
      const parsedDate = new Date(value);
      value = Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    frontMatter[key] = value;
  }

  return frontMatter;
}
