import Icon from '@/v2/components/ui/Icon';
import Dropdown from '@/v2/components/ui/Dropdown';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import IconButton from '../IconButton';

const LanguageButton = () => {
  const { t } = useTranslation();
  const label = t('v2.ui.language.label');
  const languages = Object.keys(i18n.services.resourceStore.data);
  const currentLang = i18n.language;
  const displayNames = new Intl.DisplayNames([currentLang], { type: 'language' });

  const selectLanguage = (lang: string) => {
    localStorage.setItem('lang', lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Dropdown
      aria-label={label}
      content={languages.map((lang) => (
        <button
          key={lang}
          role="option"
          aria-selected={lang === currentLang}
          onClick={() => selectLanguage(lang)}
          className={`flex w-full items-center justify-between px-4 py-2 first:rounded-t-2xl last:rounded-b-2xl hover:bg-shadow cursor-pointer focus-visible:outline-2 focus-visible:outline-secondary ${lang === currentLang ? 'bg-shadow' : ''}`}
        >
          <span>{displayNames.of(lang)}</span>
        </button>
      ))}
    >
      <IconButton aria-label={label} data-testid="language-switch" hint={t('v2.ui.language.hint')}>
        <Icon type="language" />
      </IconButton>
    </Dropdown>
  );
};

export default LanguageButton;
