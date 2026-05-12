import { AppLink } from '@/components';
import { useTranslation } from 'react-i18next';

const PublicNotFoundView = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <img
        src="/img/Paula_schlafend.svg"
        alt={t('errors.schoolClosedImage')}
        role="img"
        loading="lazy"
        className="w-16"
      />
      <p className="text-center mt-4">{t('errors.unauthorized')}</p>
    </div>
  );
};

export default PublicNotFoundView;
