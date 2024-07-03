import { XMLParser } from "fast-xml-parser";

export function parseXML(
  xmlString: string
): Array<{ start: number; dur: number; content: string }> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    textNodeName: "content",
  });

  const result = parser.parse(xmlString);

  if (!result.transcript || !result.transcript.text) {
    throw new Error("Invalid XML structure");
  }

  // Ensure text is always an array
  const texts = Array.isArray(result.transcript.text)
    ? result.transcript.text
    : [result.transcript.text];

  return texts.map((text: any) => ({
    start: parseFloat(text.start),
    dur: parseFloat(text.dur),
    content: text.content || "",
  }));
}
