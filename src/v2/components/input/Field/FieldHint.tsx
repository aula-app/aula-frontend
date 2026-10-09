import Collapse from '@/v2/components/ui/Collapse';
import Icon from '@/v2/components/ui/Icon';
import { ReactNode } from 'react';
import { Text } from 'react-aria-components';

interface FieldHintProps {
  error?: string;
  helperText?: ReactNode;
}

/** Must render inside a react-aria field so the slots link to the control's aria-describedby. */
const FieldHint = ({ error, helperText }: FieldHintProps) => (
  <Collapse open={!!(error || helperText)}>
    {error ? (
      <Text slot="errorMessage" className="block pt-1 px-1 text-xs text-error-fg">
        <Icon type="alert" className="inline-block mr-1 mb-0.5" />
        {error}
      </Text>
    ) : (
      helperText && (
        <Text slot="description" className="block pt-1 px-1 text-xs text-muted">
          {helperText}
        </Text>
      )
    )}
  </Collapse>
);

export default FieldHint;
