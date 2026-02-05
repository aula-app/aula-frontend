import { Breadcrumb } from '@/components';
import Icon from '@/components/new/Icon';
import { useAppStore } from '@/store/AppStore';

interface TopBarProps {
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement>;
}

/**
 * TopBar component that provides navigation, breadcrumbs, and user controls
 * @component TopBar
 */
const TopBar: React.FC<TopBarProps> = ({ mobileMenuOpen, onToggleMobileMenu, menuButtonRef }) => {
  const [appState] = useAppStore();

  // Get the current context name: room name from breadcrumb if available, or "aula"
  const getCurrentContextName = () => {
    if (appState.breadcrumb.length > 0 && appState.breadcrumb[0][0]) {
      return appState.breadcrumb[0][0];
    }
    return 'aula';
  };

  return (
    <header
      className="relative z-[9999] bg-primary h-14 shrink-0 flex items-center px-2 py-1 shadow-sm"
      onClick={() => mobileMenuOpen && onToggleMobileMenu()}
    >
      <div className="flex-1 flex items-center justify-start h-full">
        <Breadcrumb />
      </div>
      <div className="flex-1 h-full flex items-center justify-center text-lg">{getCurrentContextName()}</div>
      <div className="flex-1 h-full items-center justify-end flex">
        <div className="sm:hidden">
          <button
            ref={menuButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              onToggleMobileMenu();
            }}
            className="relative overflow-hidden flex items-center justify-center h-full aspect-square p-2 rounded-full hover:bg-black/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-sidebar-menu"
            aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
          >
            <Icon type={mobileMenuOpen ? 'close' : 'menu'} size="1.5rem" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
