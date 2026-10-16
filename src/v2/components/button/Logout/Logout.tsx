import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLogout } from '@/v2/hooks/useLogout';
import Icon from '../../ui/Icon';
import Tooltip from '../../ui/Tooltip';
import Button from '../Button';

const Logout: FC = (restOfProps) => {
  const { t } = useTranslation();
  const logout = useLogout();

  return (
    <Tooltip content={t('v2.ui.logout.label')}>
      <Button text id="logout-button" type="button" onClick={logout} className="w-full shrink-0" {...restOfProps}>
        {`${t('v2.ui.logout.button')}`}
        <Icon type="logout" />
      </Button>
    </Tooltip>
  );
};

Logout.displayName = 'Logout';

export default Logout;
