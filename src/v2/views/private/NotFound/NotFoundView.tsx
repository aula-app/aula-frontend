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
      <Tooltip content={t('v2.page.notFound.hint')} wrapperClassName="flex items-center gap-3 text-error-text" tapToShow>
        <Button text color="error" className="flex items-center gap-3">
          <Icon type="alert" size="24" />
          {t('v2.page.notFound.title')}
        </Button>
      </Tooltip>

      {/* Hidden toast triggers for Playwright tests */}
      <div className="sr-only" aria-hidden="true">
        <button data-testid="test-toast-success" tabIndex={-1} onClick={() => toast.success('Success toast')}>success</button>
        <button data-testid="test-toast-error" tabIndex={-1} onClick={() => toast.error('Error toast')}>error</button>
        <button data-testid="test-toast-warning" tabIndex={-1} onClick={() => toast.warning('Warning toast')}>warning</button>
        <button data-testid="test-toast-info" tabIndex={-1} onClick={() => toast.info('Info toast')}>info</button>
      </div>
    </div>
  );
};

export default PublicNotFoundView;
