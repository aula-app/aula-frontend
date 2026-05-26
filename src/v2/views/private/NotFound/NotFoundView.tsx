import Icon from '@/components/new/Icon';
import Tooltip from '@/v2/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';

const PublicNotFoundView = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-12" data-testid="not-found-view">
      <img src="/img/Paula_schlafend.svg" alt={t('v2.alt.sleeping')} loading="lazy" className="w-32" />
      <Tooltip content={t('v2.page.notFound.hint')} wrapperClassName="flex items-center gap-3 text-error" tapToShow>
        <Icon type="alert" size="24" />
        {t('v2.page.notFound.title')}
      </Tooltip>
    </div>
  );
};

export default PublicNotFoundView;
