import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.aula.neu',
  appName: 'aula',
  webDir: 'build',
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'always',
    preferredContentMode: 'mobile',
    backgroundColor: '#ffffff',
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
