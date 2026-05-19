import IconButton from '@/v2/components/button/IconButton';
import Icon from '@/v2/components/ui/Icon';
import { useTranslation } from 'react-i18next';

const DarkModeButton = () => {
  const { t } = useTranslation();

  return (
    <IconButton to="/about" aria-label={t('v2.page.about.title')} hint={t('v2.page.about.title')}>
      <Icon type="info" />
    </IconButton>
  );
};

export default DarkModeButton;
