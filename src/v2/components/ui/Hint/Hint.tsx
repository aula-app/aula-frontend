import Icon from '@/components/new/Icon';
import Tooltip from '@/v2/components/ui/Tooltip';
import { ReactNode } from 'react';

interface HintProps {
  content: ReactNode;
}

const Hint = ({ content }: HintProps) => (
  <Tooltip content={content}>
    <Icon type="about" size="1.25em" aria-label={typeof content === 'string' ? content : undefined} />
  </Tooltip>
);

export default Hint;
