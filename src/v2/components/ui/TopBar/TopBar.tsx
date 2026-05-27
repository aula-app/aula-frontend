import { useAppStore } from '@/store/AppStore';
import Breadcrumb from '@/v2/components/ui/Breadcrumb';
import Icon from '@/v2/components/ui/Icon';
import { useTranslation } from 'react-i18next';
import IconButton from '../../button/IconButton';

interface TopBarProps {
  onToggleMenu: () => void;
  menuOpen?: boolean;
}

/**
 * TopBar component that provides navigation, breadcrumbs, and user controls
 * @component TopBar
 */
const TopBar: React.FC<TopBarProps> = ({ onToggleMenu, menuOpen = false }) => {
  const { t } = useTranslation();
  const [appState] = useAppStore();

  const getCurrentContextName = () => {
    if (appState.breadcrumb.length > 0 && appState.breadcrumb[0][0]) {
      return appState.breadcrumb[0][0];
    }
    return 'aula';
  };

  return (
    <header
      id="top-bar"
      className="relative bg-primary px-2 py-1 shadow-sm pt-[calc(var(--safe-area-inset-top,0px))] z-30 print:hidden flex items-center"
      aria-label={getCurrentContextName()}
    >
      <div className="mr-3 flex h-full items-center justify-start">
        <Breadcrumb />
      </div>

      <div className="flex-1 flex items-center justify-center h-full overflow-hidden">
        <div className="font-bold truncate" aria-hidden="true">
          {getCurrentContextName()}
        </div>
      </div>

      <div className="ml-3 flex h-full items-center justify-end">
        <div className="sm:hidden">
          <IconButton
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-controls="sidebar-menu"
            aria-label={menuOpen ? t('v2.ui.menu.close') : t('v2.ui.menu.open')}
          >
            <Icon type={menuOpen ? 'close' : 'menu'} size="1.5rem" aria-hidden="true" />
          </IconButton>
        </div>
      </div>
    </header>
  );
};

TopBar.displayName = 'TopBar';

export default TopBar;
