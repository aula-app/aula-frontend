import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.aula.neu',
  appName: 'aula',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
