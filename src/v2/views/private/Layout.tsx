import Button from '@/v2/components/button/Button';
import CodeCopy from '@/v2/components/button/CodeCopy';
import Logout from '@/v2/components/button/Logout';

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col relative h-dvh w-full">
      <header className="relative bg-primary px-2 py-1 shadow-sm pt-[calc(var(--safe-area-inset-top,0px))] z-30">
        header
      </header>
      <div className="flex-1 flex flex-row-reverse">
        <main className="flex-1 flex">{children}</main>
        <nav className="flex flex-col border-secondary border-r">
          <CodeCopy />
          <hr className="border-t border-secondary" />
          Profile
          <hr className="border-t border-secondary" />
          <div className="flex-1 flex flex-col"></div>
          <hr className="border-t border-secondary" />
          <hr className="border-t border-secondary" />
          <Logout />
        </nav>
      </div>
    </div>
  );

  const { t } = useTranslation();
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
      {checkPermissions('system', 'hide') ? (
        <TechTopBar
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={toggleMobileMenu}
          menuButtonRef={menuButtonRef}
        />
      ) : (
        <TopBar mobileMenuOpen={mobileMenuOpen} onToggleMobileMenu={toggleMobileMenu} menuButtonRef={menuButtonRef} />
      )}
      <div className="flex min-h-0 flex-1 overflow-hidden relative">
        {!checkPermissions('system', 'hide') && (
          <nav
            id="mobile-sidebar-menu"
            ref={sidebarRef}
            aria-label={t('ui.navigation.mainMenu')}
            className={
              'flex w-64 h-full border-r absolute bg-paper border-gray-200 no-print overflow-y-auto transition-all z-20 ' +
              (mobileMenuOpen ? 'left-0' : '-left-64') +
              ' sm:relative sm:left-0'
            }
          >
            <SideBar onClose={toggleMobileMenu} />
          </nav>
        )}
        <div
          className={
            'fixed inset-0 bg-black/50 transition-opacity z-10 ' +
            (mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')
          }
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
        <main
          id="main-content"
          className="flex-1 flex relative z-0"
          style={{
            paddingBottom: 'var(--safe-area-inset-bottom, 0px)',
            scrollPaddingBottom: '6rem',
          }}
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
