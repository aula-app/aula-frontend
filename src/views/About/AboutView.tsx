import { useAppStore } from '@/store/AppStore';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { versionsRequest, VersionsResponse } from '@/services/requests-v2';

/**
 * Renders "About" view
 * url: /about
 */
const AboutView = () => {
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
    <Stack sx={{ padding: '20px 20px', overflow: 'auto' }}>
      <h2>aula-Software</h2>
      <code>
        aula-frontend: &nbsp;{import.meta.env?.VITE_APP_VERSION ?? 'unknown'}
        <br />
        aula-backend.v1: &nbsp;{versions?.['aula-backend.v1']?.['aula-backend']?.running ?? 'unknown'}
        <br />
        aula-backend.v2: &nbsp;{versions?.['aula-backend.v2']?.['aula-backend']?.running ?? 'unknown'}
      </code>
      <br />
      <hr />
      <h2>Herausgeber</h2>
      aula gGmbH
      <br />
      Alte Schönhauser Straße 23/24
      <br />
      10119 Berlin
      <br />
      Fon: 030-28040850
      <br />
      E-Mail: info@aula.de
      <p>
        Die aula gGmbH ist beim Amtsregister Charlottenburg unter der Nummer 244593 B registriert. Vertreten durch:
        Alexa Schaegner (Geschäftsführung), Steffen Wenzel (Geschäftsführung)
      </p>
    </Stack>
  );
};

export default AboutView;
