import { Emoji, emojis, shortcodeToEmoji } from '@tiptap/extension-emoji';

/**
 * Tiptap's `Emoji` node serializes to the `:shortcode:` syntax by default,
 * which leaks into the stored markdown and shows up literally when the content
 * is loaded back into the editor (the node has no `parseMarkdown`, so a
 * shortcode never round-trips into an emoji node). Serializing to the native
 * unicode character instead round-trips cleanly as plain text and renders
 * everywhere without extra plugins.
 */
const EmojiExtension = Emoji.extend({
  renderMarkdown(node: { attrs?: { name?: string } }) {
    const name = node.attrs?.name;
    if (!name) return '';
    return shortcodeToEmoji(name, emojis)?.emoji ?? `:${name}:`;
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
  markdown.replace(SHORTCODE_RE, (match, name) => shortcodeToEmoji(name, emojis)?.emoji ?? match);

export default EmojiExtension;
