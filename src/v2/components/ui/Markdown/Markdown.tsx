import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { twMerge } from 'tailwind-merge';

interface MarkdownProps {
  /** Markdown string, e.g. Tiptap's serialized `idea.content`. */
  children: string;
  className?: string;
}

/**
 * Renders a markdown string as styled HTML. Uses the Tailwind typography
 * plugin (`prose`) for sensible defaults; pass `className` to tweak size or
 * constrain height (e.g. `prose-sm line-clamp-3` for compact previews).
 *
 * `remark-gfm` matches the GitHub-Flavored Markdown that Tiptap emits (its
 * serializer is built on `marked`), so strikethrough, tables, task lists and
 * autolinks render correctly. No raw-HTML plugin on purpose: content comes
 * from Tiptap's markdown serializer, so there is no raw HTML and no XSS surface.
 */
const Markdown = ({ children, className }: MarkdownProps) => (
  <div className={twMerge('prose max-w-none dark:prose-invert', className)}>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  </div>
);

export default Markdown;
