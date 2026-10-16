import Icon from '@/components/new/Icon';
import Button from '@/v2/components/button/Button/Button';
import { useToast } from '@/v2/hooks';
import { useHidePublicHero } from '@/v2/views/public/PublicLayoutContext';
import { useTranslation } from 'react-i18next';

const PublicNotFoundView = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  useHidePublicHero();

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

      {/* Hidden toast triggers for Playwright tests */}
      <div className="sr-only" aria-hidden="true">
        <button data-testid="test-toast-success" tabIndex={-1} onClick={() => toast.success('Success toast')}>
          success
        </button>
        <button data-testid="test-toast-error" tabIndex={-1} onClick={() => toast.error('Error toast')}>
          error
        </button>
        <button data-testid="test-toast-warning" tabIndex={-1} onClick={() => toast.warning('Warning toast')}>
          warning
        </button>
        <button data-testid="test-toast-info" tabIndex={-1} onClick={() => toast.info('Info toast')}>
          info
        </button>
      </div>
    </div>
  );
};

export default PublicNotFoundView;
