import Icon from '@/components/new/Icon';
import Tooltip from '@/v2/components/ui/Tooltip';
import { ReactNode } from 'react';

type HintProps =
  | { content: string; label?: string }
  | { content: ReactNode; label: string };

const Hint = ({ content, label }: HintProps) => (
  <Tooltip content={content}>
    <Icon type="about" size="1.25em" aria-label={label ?? (content as string)} />
  </Tooltip>
);

export default Hint;
