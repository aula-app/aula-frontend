import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.aula.neu',
  appName: 'aula',
  webDir: 'build',
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
    backgroundColor: '#000000',
    allowsLinkPreview: true,
    scheme: 'aula',
    limitsNavigationsToAppBoundDomains: true,
  },
  plugins: {
    Keyboard: {
      resizeOnFullScreen: true,
    },
  },
};

export default config;
