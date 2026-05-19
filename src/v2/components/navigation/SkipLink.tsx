import { useTranslation } from 'react-i18next';

const SkipLink = () => {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-paper focus:text-text-primary focus:outline-2 focus:outline-primary"
    >
      {t('ui.navigation.skipToContent')}
    </a>
  );
};

export default SkipLink;
