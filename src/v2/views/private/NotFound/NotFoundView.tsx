import Icon from '@/components/new/Icon';
import Button from '@/v2/components/button/Button/Button';
import Tooltip from '@/v2/components/ui/Tooltip';
import { useToast } from '@/v2/hooks';
import { useTranslation } from 'react-i18next';

const PublicNotFoundView = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-12" data-testid="not-found-view">
      <img src="/img/Paula_schlafend.svg" alt={t('v2.alt.sleeping')} loading="lazy" className="w-32" />
      <Tooltip content={t('v2.page.notFound.hint')} wrapperClassName="flex items-center gap-3 text-error" tapToShow>
        <Button text color="error" className="flex items-center gap-3">
          <Icon type="alert" size="24" />
          {t('v2.page.notFound.title')}
        </Button>
      </Tooltip>

      {/* Toast test buttons — remove before merging */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button onClick={() => toast.success('Success toast works!')} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Success</button>
        <button onClick={() => toast.error('Error toast works!')} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Error</button>
        <button onClick={() => toast.warning('Warning toast works!')} className="px-3 py-1 rounded bg-yellow-500 text-white text-sm">Warning</button>
        <button onClick={() => toast.info('Info toast works!')} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Info</button>
      </div>
    </div>
  );
};

export default PublicNotFoundView;
