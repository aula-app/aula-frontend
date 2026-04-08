import Icon from '@/components/new/Icon';
import IconButton from '@/components/new/IconButton';
import { getRuntimeConfig } from '@/config';
import { useEventLogout } from '@/hooks';
import { useTranslation } from 'react-i18next';

interface TopBarProps {
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement>;
}

const TechTopBar: React.FC<TopBarProps> = () => {
  const { t } = useTranslation();
  const onLogout = useEventLogout();

  return (
    <header className="relative bg-primary px-6 py-1 shadow-sm pt-[calc(var(--safe-area-inset-top,0px))] z-30">
      <div className="relative flex shrink-0 items-center h-14">
        <div className="flex h-full items-center justify-start">
          <img
            src={`${getRuntimeConfig().BASENAME}img/Aula_Icon.svg`}
            alt={t('app.name.logo')}
            role="img"
            className="h-8 w-auto"
          />
        </div>
        <div className="flex-1 flex items-center justify-center h-full overflow-hidden">
          {t('ui.navigation.adminPanel')}
        </div>
        <IconButton onClick={onLogout} aria-label={t('auth.logout')}>
          <Icon type="logout" size="1.5rem" aria-hidden="true" />
        </IconButton>
      </div>
    </header>
  );
};

export default TechTopBar;
