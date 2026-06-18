import Icon from '@/components/new/Icon';
import Button from '@/v2/components/button/Button/Button';
import { useTranslation } from 'react-i18next';

const OfflineView = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-16" data-testid="school-offline-view">
      <img src="/img/Paula_schlafend.svg" alt={t('v2.alt.sleeping')} loading="lazy" className="w-32" />
      <div className="flex flex-col items-center gap-4">
        <span className="flex items-center gap-3 text-error-fg font-bold text-xl">
          <Icon type="alert" />
          {t('v2.page.offline.title')}
        </span>
        <p className="text-center text-muted">{t('v2.page.offline.hint')}</p>
      </div>
    </div>
  );
};

export default OfflineView;
