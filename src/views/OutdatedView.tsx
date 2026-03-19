import { useTranslation } from 'react-i18next';

const OutdatedView = () => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center gap-4 p-4 text-center">
      <img
        src="/img/Paula_zwinkernd.svg"
        alt={t('errors.appOutdatedImage')}
        role="img"
        loading="lazy"
        className="w-40 max-w-full"
      />
      <p className="mt-6 text-base text-gray-900">{t('errors.appOutdated')}</p>
    </section>
  );
};

export default OutdatedView;
