import { getRuntimeConfig } from '@/config';
import { localStorageGet } from '@/utils';
import { useToast } from '@/v2/hooks';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import Icon from '../../ui/Icon';
import Button from '../Button';
import Tooltip from '../../ui/Tooltip';

const CodeCopy: FC<Omit<React.ComponentProps<typeof Button>, 'outlined' | 'text'>> = ({
  className,
  ...restOfProps
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const code = localStorageGet('code');

  if (!getRuntimeConfig().IS_MULTI || !code) {
    return null;
  }

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(code)
      .then(() => toast.success(t('v2.ui.code.success')))
      .catch(() => toast.error(t('v2.ui.code.error')));
  };

  return (
    <Button
      text
      id="instance-code"
      type="button"
      onClick={handleCopy}
      aria-label={t('v2.ui.code.copy')}
      className={twMerge('mx-2 my-2 py-[0.1rem]', className)}
      {...restOfProps}
    >
      {`${t('v2.ui.code.button', { var: code })}`}
      <Icon type="copy" />
    </Button>
  );
};

CodeCopy.displayName = 'CodeCopy';

export default CodeCopy;
