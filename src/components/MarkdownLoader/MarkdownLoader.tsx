import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

interface MarkdownLoaderProps {
  src: string;
  [key: string]: any;
}

const MarkdownLoader: FC<MarkdownLoaderProps> = ({ src, ...restOfProps }) => {
  const [markdown, setMarkdown] = useState('');
  const { i18n } = useTranslation();

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const response = await fetch(src);

        if (!response.ok) {
          // Fallback to English if file not found
          const fallbackResponse = await fetch(src);
          const fallbackText = await fallbackResponse.text();
          setMarkdown(fallbackText);
          return;
        }

        const text = await response.text();
        setMarkdown(text);
      } catch (error) {
        console.error('Error loading markdown:', error);
        setMarkdown('# Error loading content');
      }
    };

    loadMarkdown();
  }, [src, i18n.language]);

  return <ReactMarkdown {...restOfProps}>{markdown}</ReactMarkdown>;
};

export default MarkdownLoader;
