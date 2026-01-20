import { Breadcrumb } from '@/components';
import MessagesButton from '@/components/Buttons/MessagesButton';
import UpdatesButton from '@/components/Buttons/UpdatesButton';
import Icon from '@/components/new/Icon';
import IconButton from '@/components/new/IconButton';
import { getRuntimeConfig } from '@/config';
import { useAppStore } from '@/store/AppStore';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import SideBarContent from '../SideBar/SideBar';

/**
 * TopBar component that provides navigation, breadcrumbs, and user controls
 * @component TopBar
 */
const TopBar: React.FC = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appState] = useAppStore();

  const location = useLocation().pathname.split('/');

  // Calculate return path based on current location
  const getReturnPath = () => {
    if (appState.breadcrumb.length >= 2) {
      if (
        appState.breadcrumb[appState.breadcrumb.length - 1][1] != undefined &&
        !appState.breadcrumb[appState.breadcrumb.length - 1][1].endsWith('/phase/0')
      ) {
        return appState.breadcrumb[appState.breadcrumb.length - 2][1];
      }
    }
    return '/';
  };

  return (
    <header className="relative z-10 bg-primary h-14 flex items-center px-2 py-1 shadow-sm">
      <div className="flex-1 flex items-center justify-start h-full">
        {location[1] === '' ? (
          <IconButton to="/" className="h-full">
            <img
              src={`${getRuntimeConfig().BASENAME}img/Aula_Icon.svg`}
              alt={t('app.name.icon')}
              className="h-full object-contain"
            />
          </IconButton>
        ) : (
          <IconButton to={getReturnPath()} className="h-full">
            <Icon type="back" size="1.5rem" />
          </IconButton>
        )}
      </div>
      <div className="flex-1 h-full flex items-center justify-center text-lg">
        <Breadcrumb />
      </div>
      <div className="flex-1 h-full items-center justify-end flex sm:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="relative overflow-hidden flex items-center justify-center h-full aspect-square p-2 rounded-full hover:bg-black/10 transition-colors"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          <Icon type={mobileMenuOpen ? 'close' : 'menu'} size="1.5rem" />
        </button>
        {mobileMenuOpen && (
          <div
            className="fixed overflow-auto top-12 right-0 left-0 bottom-0 bg-paper non-print"
            onClick={() => setMobileMenuOpen(false)}
          >
            <SideBarContent />
          </div>
        )}
      </div>
      <div className="flex-1 h-full items-center justify-end hidden sm:flex pr-1">
        <UpdatesButton />
        <MessagesButton />
      </div>
    </header>
  );
};

export default TopBar;
