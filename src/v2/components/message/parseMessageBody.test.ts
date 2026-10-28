import { describe, expect, it } from 'vitest';
import { parseMessageBody } from './parseMessageBody';

describe('parseMessageBody', () => {
  it('splits the front-matter fields from the content', () => {
    const body = `
---
type: deleteAccount
id: abc123
username: aula
---
A data deletion procedure was requested for user aula`;

    expect(parseMessageBody(body)).toEqual({
      metadata: { type: 'deleteAccount', id: 'abc123', username: 'aula' },
      content: 'A data deletion procedure was requested for user aula',
    });
  });

  it('keeps values that contain the separator themselves', () => {
    const body = '---\nuserAgent: Mozilla/5.0 (X11; Linux): Gecko\nversions: {"api": "1.2"}\n---\nIt broke';

    expect(parseMessageBody(body).metadata).toEqual({
      userAgent: 'Mozilla/5.0 (X11; Linux): Gecko',
      versions: '{"api": "1.2"}',
    });
  });

  it('treats a body without front matter as plain content', () => {
    expect(parseMessageBody('  Hello **class**  ')).toEqual({ metadata: {}, content: 'Hello **class**' });
  });

  it('ignores a separator that only appears later in the content', () => {
    expect(parseMessageBody('Intro\n---\nnot: metadata\n---\n').metadata).toEqual({});
  });

  it('handles an empty or missing body', () => {
    expect(parseMessageBody(undefined)).toEqual({ metadata: {}, content: '' });
  });
});
