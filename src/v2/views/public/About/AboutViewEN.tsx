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
    <div className="flex-1 min-h-0 overflow-y-auto w-full p-4">
      <h2>aula Software</h2>
      <code>
        aula-frontend: &nbsp;{import.meta.env?.VITE_APP_VERSION ?? 'unknown'}
        <br />
        aula-backend.v1: &nbsp;{versions?.['aula-backend.v1']?.['aula-backend']?.running ?? 'unknown'}
        <br />
        aula-backend.v2: &nbsp;{versions?.['aula-backend.v2']?.['aula-backend']?.running ?? 'unknown'}
      </code>
      <br />
      <hr className="my-4" />
      <div lang="en">
        <h2>Publisher</h2>
        <h4>aula gGmbH</h4>
        <p>Alte Schönhauser Straße 23/24</p>
        <p>10119 Berlin</p>
        <p>Phone: 030-28040850</p>
        <p>E-Mail: info@aula.de</p>
        <p>
          aula gGmbH is registered at the Charlottenburg district court under number 244593 B. Represented by:
          Alexa Schaegner (Managing Director), Steffen Wenzel (Managing Director)
        </p>
      </div>
    </div>
  );
};

export default AboutViewEN;
