import Icon from '@/v2/components/ui/Icon';
import IconButton from '@/v2/components/button/IconButton';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const DarkModeButton = () => {
  const { t } = useTranslation();
  const languages = Object.keys(i18n.services.resourceStore.data);
  const currentIndex = languages.indexOf(i18n.language);
  const nextLanguage = languages[(currentIndex + 1) % languages.length];

  const cycleLanguage = () => {
    localStorage.setItem('lang', nextLanguage);
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <IconButton
      onClick={cycleLanguage}
      aria-label={t('actions.switchLanguage', {
        var: new Intl.DisplayNames([i18n.language], { type: 'language' }).of(nextLanguage),
      })}
    >
      <Icon type="language" size="1.25em" />
    </IconButton>
  );
};

export default DarkModeButton;
