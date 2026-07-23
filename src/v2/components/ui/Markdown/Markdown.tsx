import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { twMerge } from 'tailwind-merge';

interface MarkdownProps {
  children: string;
  className?: string;
}

const Markdown = ({ children, className }: MarkdownProps) => (
  <div className={twMerge('prose max-w-none dark:prose-invert', className)}>
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkEmoji]}>{children}</ReactMarkdown>
  </div>
);

export default Markdown;
