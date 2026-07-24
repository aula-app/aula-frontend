import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { afterEach, describe, expect, it } from 'vitest';
import EmojiExtension, { shortcodesToUnicode } from './emojiExtension';

const makeEditor = (content = '') =>
  new Editor({
    element: document.createElement('div'),
    extensions: [StarterKit, EmojiExtension, Markdown],
    content,
  });

const serialize = (editor: Editor) => editor.storage.markdown.manager.serialize(editor.getJSON());

let editor: Editor | undefined;
afterEach(() => {
  editor?.destroy();
  editor = undefined;
});

describe('EmojiExtension markdown serialization', () => {
  it('serializes an emoji node to the native unicode character, not a shortcode', () => {
    editor = makeEditor();
    editor.commands.setEmoji('smile');

    const markdown = serialize(editor);
    expect(markdown).toContain('😄');
    expect(markdown).not.toContain(':smile:');
  });

  it('round-trips: serialized emoji reloads as the emoji character, not a literal shortcode', () => {
    editor = makeEditor();
    editor.commands.setEmoji('rocket');
    const markdown = serialize(editor);

    editor.commands.setContent(markdown);
    expect(editor.getText()).toContain('🚀');
    expect(editor.getText()).not.toContain(':rocket:');
  });
});

describe('shortcodesToUnicode', () => {
  it('converts legacy shortcode content to native emoji', () => {
    const result = shortcodesToUnicode('Hello :grinning: :rocket: world');
    expect(result).toContain('🚀');
    expect(result).not.toContain(':grinning:');
    expect(result).not.toContain(':rocket:');
  });

  it('leaves non-emoji token sequences untouched', () => {
    expect(shortcodesToUnicode('nginx :not_an_emoji: config')).toContain(':not_an_emoji:');
  });

  it('loads legacy shortcode content into the editor as emoji, not literal text', () => {
    editor = makeEditor(shortcodesToUnicode(':grinning: hi'));
    expect(editor.getText()).not.toContain(':grinning:');
  });
});
