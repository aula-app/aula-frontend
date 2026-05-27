import Icon from '@/components/new/Icon';
import Button from '@/v2/components/button/Button/Button';
import Tooltip from '@/v2/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';

const OfflineView = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-around" data-testid="school-offline-view">
      <img src="/img/Paula_schlafend.svg" alt={t('v2.alt.sleeping')} loading="lazy" className="w-32" />
      <Tooltip content={t('v2.page.offline.hint')} wrapperClassName="flex items-center gap-3 text-error" tapToShow>
        <Button text color="error" className="flex items-center gap-3">
          <Icon type="alert" size="24" />
          {t('v2.page.offline.title')}
        </Button>
      </Tooltip>
    </div>
  );
};

export default OfflineView;
