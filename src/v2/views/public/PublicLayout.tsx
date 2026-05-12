import { getRuntimeConfig } from '@/config';
import CodeButton from '@/v2/components/button/Code';
import LanguageButton from '@/v2/components/button/Language';
import { FunctionComponent, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import PublicRoutes from './PublicRoutes';
import Link from '@/v2/components/navigation/Link';

const PublicLayout: FunctionComponent<PropsWithChildren> = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="w-full h-full max-w-sm mx-auto px-8 py-6 flex flex-col">
      <header className="flex-2 flex flex-col">
        <nav className="flex items-center">
          <div className="flex-1">
            {!['/v2', '/v2/'].includes(location.pathname) && (
              <Link to="/v2" className="text-sm text-text-secondary">
                &lt; {t('auth.login.button')}
              </Link>
            )}
          </div>
          <div className="flex-2 flex justify-center">
            <CodeButton />
          </div>
          <div className="flex-1 flex justify-end">
            <LanguageButton />
          </div>
        </nav>
        <div className="flex-1 flex justify-center">
          <img src={`${getRuntimeConfig().BASENAME}img/Aula_Hero.svg`} alt={t('app.name.logo')} role="img" />
        </div>
      </header>
      <main className="flex-2 flex">
        <PublicRoutes />
      </main>
      <footer className="flex-1"></footer>
    </div>
  );
};

export default PublicLayout;
