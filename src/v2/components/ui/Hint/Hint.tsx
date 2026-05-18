import Icon from '@/components/new/Icon';
import IconButton from '@/v2/components/button/IconButton';
import Tooltip from '@/v2/components/ui/Tooltip';
import { ReactNode } from 'react';

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface HintProps {
  content: ReactNode;
  placement?: Placement;
}

const Hint = ({ content, placement = 'top' }: HintProps) => (
  <Tooltip content={content} placement={placement}>
    <IconButton type="button" dense>
      <Icon type="about" size="1.25em" aria-label={typeof content === 'string' ? content : undefined} />
    </IconButton>
  </Tooltip>
);

export default Hint;
