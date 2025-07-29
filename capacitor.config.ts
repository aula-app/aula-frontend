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
    SafeArea: {
      enabled: true,
      customColorsForSystemBars: false,
      statusBarBackgroundColor: '#000000',
      statusBarStyle: 'dark',
      navigationBarBackgroundColor: '#000000',
      navigationBarStyle: 'dark',
    },
  },
};

export default config;
