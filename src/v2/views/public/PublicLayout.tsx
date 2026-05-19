import CodeButton from '@/v2/components/button/Code';
import LanguageButton from '@/v2/components/button/Language';
import AulaHero from '@/v2/components/svg/Aula_Hero.svg?react';
import { FunctionComponent, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import PublicRoutes from '@/routes/PublicRoutes';
import Link from '@/v2/components/navigation/Link';
import SkipLink from '@/v2/components/navigation/SkipLink';
import DarkModeButton from '@/v2/components/button/DarkMode';

const PublicLayout: FunctionComponent<PropsWithChildren> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="w-full h-full max-w-sm mx-auto px-8 py-6 flex flex-col gap-6">
      <SkipLink />
      <header className="flex-2 flex flex-col gap-4">
        <nav className="flex items-center" aria-label={t('ui.navigation.mainMenu')}>
          <div className="flex-1">
            {location.pathname !== '/' && (
              <Link to="/" className="text-sm text-text-secondary">
                <span aria-hidden="true">&lt; </span> {t('auth.login.button')}
              </Link>
            )}
          </div>
          <div className="flex-2 flex justify-center">
            <CodeButton />
          </div>
        </nav>
        <div className="flex-1 flex justify-center">
          <AulaHero aria-label={t('app.name.logo')} role="img" className="text-text-primary" />
        </div>
      </header>
      <main id="main-content" className="flex-2 flex">
        <PublicRoutes />
      </main>
      <footer className="flex-1 flex items-end justify-between">
        <DarkModeButton />
        <LanguageButton />
      </footer>
    </div>
  );
};

export default PublicLayout;
