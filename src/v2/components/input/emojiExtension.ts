import { Emoji, emojis, shortcodeToEmoji } from '@tiptap/extension-emoji';

/**
 * Tiptap's dataset stores emoji in their unqualified form, so characters that
 * default to text presentation (e.g. `❤` U+2764) lack the `U+FE0F` variation
 * selector and render as monochrome glyphs. Append the selector so they render
 * as color emoji everywhere. ASCII bases (digit keycaps `0`-`9`, `#`, `*`) are
 * left alone since they never arrive from the dataset.
 */
const emojiPresentation = (emoji: string): string => {
  const isTextDefault =
    [...emoji].length === 1 &&
    (emoji.codePointAt(0) ?? 0) > 0x7f &&
    /\p{Emoji}/u.test(emoji) &&
    !/\p{Emoji_Presentation}/u.test(emoji);
  return isTextDefault ? `${emoji}️` : emoji;
};

/**
 * A copy of Tiptap's dataset with every emoji forced to color presentation.
 * Feeding this to the extension (and our own lookups) makes the fix apply to
 * every render path at once: the DOM in the editor, copied text, and the
 * serialized markdown all use the same qualified character.
 */
const qualifiedEmojis = emojis.map((item) => (item.emoji ? { ...item, emoji: emojiPresentation(item.emoji) } : item));

/**
 * Tiptap's `Emoji` node serializes to the `:shortcode:` syntax by default,
 * which leaks into the stored markdown and shows up literally when the content
 * is loaded back into the editor (the node has no `parseMarkdown`, so a
 * shortcode never round-trips into an emoji node). Serializing to the native
 * unicode character instead round-trips cleanly as plain text and renders
 * everywhere without extra plugins.
 */
const EmojiExtension = Emoji.extend({
  addOptions() {
    return { ...this.parent!(), emojis: qualifiedEmojis };
  },
  renderMarkdown(node: { attrs?: { name?: string } }) {
    const name = node.attrs?.name;
    if (!name) return '';
    return shortcodeToEmoji(name, qualifiedEmojis)?.emoji ?? `:${name}:`;
  },
});

const SHORTCODE_RE = /:([a-zA-Z0-9_+-]+):/g;

/**
 * Replaces `:shortcode:` emoji syntax with the native unicode character.
 * `marked` (used by `@tiptap/markdown`) has no rule for shortcodes, so legacy
 * content saved in that form would otherwise load into the editor literally.
 * Normalizing on the way in keeps the editor on the same native-unicode format
 * this extension serializes to. Non-emoji `:token:` sequences are left intact.
 */
export const shortcodesToUnicode = (markdown: string): string =>
  markdown.replace(SHORTCODE_RE, (match, name) => shortcodeToEmoji(name, qualifiedEmojis)?.emoji ?? match);

export default EmojiExtension;
