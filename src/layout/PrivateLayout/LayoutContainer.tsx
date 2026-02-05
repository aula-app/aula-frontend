import SkipNavigation from '@/components/SkipNavigation';
import AskConsent from '@/views/AskConsent';
import { FunctionComponent, PropsWithChildren, useEffect, useRef, useState } from 'react';
import TopBar from './TopBar';
import { checkPermissions } from '@/utils';
import SideBar from './SideBar';

const LayoutContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // Focus management: Move focus into menu when opened, return to button when closed
  useEffect(() => {
    if (mobileMenuOpen && sidebarRef.current) {
      // Focus the first menu item when menu opens
      const firstMenuItem = sidebarRef.current.querySelector('[role="menuitem"]') as HTMLElement;
      if (firstMenuItem) {
        firstMenuItem.focus();
      }
    } else if (!mobileMenuOpen && menuButtonRef.current && document.activeElement?.closest('#mobile-sidebar-menu')) {
      // Return focus to menu button when closing (only if focus was inside menu)
      menuButtonRef.current.focus();
    }
  }, [mobileMenuOpen]);

  // Close menu when focus leaves the menu context
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleFocusChange = () => {
      const focusedElement = document.activeElement;

      // Don't close if focus is still in the sidebar
      if (sidebarRef.current?.contains(focusedElement)) {
        return;
      }

      // Don't close if a MUI Select menu is open (check for MuiList-root which is used by Select)
      const selectMenuOpen = document.querySelector('.MuiList-root[role="listbox"]');
      if (selectMenuOpen) {
        return;
      }

      // Close the sidebar if focus has genuinely left
      toggleMobileMenu();
    };

    // Use a small delay to allow focus to settle
    const timeoutId = setTimeout(() => {
      document.addEventListener('focusin', handleFocusChange);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('focusin', handleFocusChange);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden">
      <SkipNavigation mainContentId="main-content" />
      <TopBar
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
        menuButtonRef={menuButtonRef}
      />
      <div className="flex min-h-0 flex-1">
        {!checkPermissions('system', 'hide') && (
          <nav
            id="mobile-sidebar-menu"
            ref={sidebarRef}
            aria-label="Main navigation"
            className={
              'flex w-64 h-full max-h-[calc(100vh-3.5rem)] border-r absolute bg-paper border-gray-200 no-print overflow-y-auto transition-all z-1100 ' +
              (mobileMenuOpen ? 'left-0' : '-left-64') +
              ' sm:relative sm:left-0'
            }
          >
            <SideBar onClose={toggleMobileMenu} />
          </nav>
        )}
        <div
          className={
            'fixed inset-0 bg-black/50 z-1050 transition-opacity ' +
            (mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')
          }
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
        <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
          {children}
        </main>
        <AskConsent />
      </div>
    </div>
  );
};

export default LayoutContainer;
