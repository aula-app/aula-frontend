import PublicRoutes from '@/routes/PublicRoutes';
import AboutButton from '@/v2/components/button/About';
import CodeButton from '@/v2/components/button/Code';
import DarkModeButton from '@/v2/components/button/DarkMode';
import LanguageButton from '@/v2/components/button/Language';
import Link from '@/v2/components/navigation/Link';
import AulaHero from '@/v2/components/svg/Aula_Hero.svg?react';
import { FunctionComponent, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

const PublicLayout: FunctionComponent<PropsWithChildren> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="h-full max-w-sm mx-auto px-8 py-6 flex flex-col gap-6">
      <header className="flex-1 flex flex-col gap-4">
        <nav className="flex items-center" aria-label={t('v2.ui.a11y.navigation')}>
          <div className="flex-1">
            {location.pathname !== '/' && (
              <Link to="/" className="text-sm text-text-secondary">
                <span aria-hidden="true">&lt; </span> {t('v2.page.login.button')}
              </Link>
            )}
          </div>
          <div className="text-sm">
            <CodeButton />
          </div>
        </nav>
        <div className="flex-2 flex justify-center">
          <AulaHero aria-label={t('v2.alt.logo')} role="img" className="text-text-primary w-full" />
        </div>
      </header>
      <main id="main-content" className="flex-2 flex">
        <PublicRoutes />
      </main>
      <footer className="flex items-center justify-between">
        <DarkModeButton />
        <LanguageButton />
        <AboutButton />
      </footer>
    </div>
  );
};

export default PublicLayout;
