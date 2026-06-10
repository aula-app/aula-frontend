import { usePageTitle } from '@/hooks/usePageTitle';
import { versionsRequest, VersionsResponse } from '@/services/requests-v2';
import { useAppStore } from '@/store/AppStore';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Renders "About" view (English)
 * url: /about
 */
const AboutViewEN = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const [versions, setVersions] = useState<VersionsResponse>();
  usePageTitle('pageTitles.about');

  const fetchVersions = useCallback(async () => {
    setVersions(await versionsRequest());
  }, []);

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.about'), '']] });
    fetchVersions();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-8" data-testid="about-view">
      <h1>{t('v2.page.about.title')}</h1>
      <h2>{t('v2.page.about.version')}</h2>
      <code>
        aula-frontend: &nbsp;{import.meta.env?.VITE_APP_VERSION ?? 'unknown'}
        <br />
        aula-backend.v1: &nbsp;{versions?.['aula-backend.v1']?.['aula-backend']?.running ?? 'unknown'}
        <br />
        aula-backend.v2: &nbsp;{versions?.['aula-backend.v2']?.['aula-backend']?.running ?? 'unknown'}
      </code>
      <hr />
      <h2>{t('v2.page.about.publisher')}</h2>
      <h4>aula gGmbH</h4>
      <p>Alte Schönhauser Straße 23/24</p>
      <p>10119 Berlin</p>
      <p>{t('v2.page.about.phone')}: 030-28040850</p>
      <p>{t('v2.page.about.email')}: info@aula.de</p>
      <p>{t('v2.page.about.legal')}</p>
    </div>
  );
};

export default AboutViewEN;
