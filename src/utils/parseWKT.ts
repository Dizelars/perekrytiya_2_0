export function parseWKT(wkt: string): [number, number][][] {
  if (!wkt) return [];

  const cleaned = wkt.trim().toUpperCase();

  if (cleaned.startsWith("LINESTRING")) {
    return [parseLine(cleaned)];
  }

  if (cleaned.startsWith("MULTILINESTRING")) {
    const content = cleaned
      .replace("MULTILINESTRING", "")
      .trim()
      .slice(1, -1);

    return splitMultiLines(content).map(parseCoords);
  }

  return [];
}

function parseLine(wkt: string): [number, number][] {
  const content = wkt.slice(wkt.indexOf("(") + 1, wkt.lastIndexOf(")"));
  return parseCoords(content);
}

function parseCoords(text: string): [number, number][] {
  return text.split(",").map((pair) => {
    const [lng, lat] = pair.trim().split(" ").map(Number);
    return [lng, lat];
  });
}

function splitMultiLines(text: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = "";

  for (const char of text) {
    if (char === "(") depth++;
    if (char === ")") depth--;

    if (char === "," && depth === 0) {
      result.push(current.trim().slice(1, -1));
      current = "";
    } else {
      current += char;
    }
  }

  if (current) {
    result.push(current.trim().slice(1, -1));
  }

  return result;
}
