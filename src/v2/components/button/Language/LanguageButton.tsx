import Icon from '@/components/new/Icon';
import Chip from '@/v2/components/button/Chip';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const LanguageButton = ({ icon = false }) => {
  const { t } = useTranslation();
  const languages = Object.keys(i18n.services.resourceStore.data);
  const currentIndex = languages.indexOf(i18n.language);
  const nextLanguage = languages[(currentIndex + 1) % languages.length];

  const cycleLanguage = () => {
    localStorage.setItem('lang', nextLanguage);
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <Chip
      condensed
      className="bg-paper text-text-primary"
      startIcon={<Icon type="language" />}
      onClick={cycleLanguage}
      hint={t('v2.ui.language.button', {
        var: new Intl.DisplayNames([i18n.language], { type: 'language' }).of(nextLanguage),
      })}
    >
      {!icon && nextLanguage.toUpperCase()}
    </Chip>
  );
};

export default LanguageButton;
