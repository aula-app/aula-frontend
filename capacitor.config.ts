import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.aula',
  appName: 'aula',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
