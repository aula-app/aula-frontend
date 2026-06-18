import Icon from '@/components/new/Icon';
import Button from '@/v2/components/button/Button/Button';
import Tooltip from '@/v2/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';

const PublicNotFoundView = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-16" data-testid="not-found-view">
      <img src="/img/Paula_zwinkernd.svg" alt={t('v2.alt.winking')} loading="lazy" className="w-32" />
      <div className="flex flex-col items-center gap-4">
        <span className="flex items-center gap-3 text-error-fg font-bold text-xl">
          <Icon type="alert" />
          {t('v2.page.notFound.title')}
        </span>
        <p className="text-center text-muted">{t('v2.page.notFound.hint')}</p>
      </div>
    </div>
  );
};

export default PublicNotFoundView;
