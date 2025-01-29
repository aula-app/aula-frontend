import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';

interface Props {
  children: string;
}

const MarkdownReader: React.FC<Props> = ({ children }) => {
  return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{children}</ReactMarkdown>;
};

export default MarkdownReader;
