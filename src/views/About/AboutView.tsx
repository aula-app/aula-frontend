import { useAppStore } from '@/store/AppStore';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
import { useEffect } from 'react';

/**
 * Renders "About" view
 * url: /about
 */
const AboutView = () => {
  const { t } = useTranslation();
  const [appState, dispatch] = useAppStore();

  useEffect(() => {
    dispatch({'action': 'SET_BREADCRUMB', "breadcrumb": [[t('ui.navigation.about'), '']]});
  }, []);

  return (
    <Stack sx={{ padding: '20px 20px', overflow: 'auto' }}>
      <h2>Herausgeber:</h2>
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
