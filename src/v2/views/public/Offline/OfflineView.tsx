import Icon from '@/components/new/Icon';
import Tooltip from '@/v2/components/ui/Tooltip';
import { useTranslation } from 'react-i18next';

const OfflineView = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-around">
      <img src="/img/Paula_schlafend.svg" alt={t('v2.alt.sleeping')} role="img" loading="lazy" className="w-32" />
      <Tooltip
        content={t('v2.page.offline.hint')}
        label={t('v2.page.offline.hint')}
        wrapperClassName="flex items-center gap-3 text-error"
      >
        <Icon type="alert" size="24" />
        {t('v2.page.offline.title')}
      </Tooltip>
    </div>
  );
};

export default OfflineView;
