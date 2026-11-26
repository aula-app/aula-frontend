export interface ParsedMessageBody {
  /** `key: value` lines from the leading `---` block, in their original order. */
  metadata: Record<string, string>;
  /** Markdown after the metadata block. */
  content: string;
}

const FRONT_MATTER = /^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export const parseMessageBody = (body = ''): ParsedMessageBody => {
  const match = body.match(FRONT_MATTER);
  if (!match) return { metadata: {}, content: body.trim() };

  const metadata: Record<string, string> = {};
  match[1].split(/\r?\n/).forEach((line) => {
    // First separator only: user agents and JSON values contain ': ' too.
    const separator = line.indexOf(': ');
    if (separator < 1) return;
    metadata[line.slice(0, separator).trim()] = line.slice(separator + 2).trim();
  });

  return { metadata, content: body.slice(match[0].length).trim() };
};
