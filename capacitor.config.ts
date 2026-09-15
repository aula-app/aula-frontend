import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.aula.neu',
  appName: 'aula',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    // Hosts the webview may navigate to directly (SSO IdP + aula instances).
    // Anything not listed here is handed off to the external browser.
    allowNavigation: ['aula.de', '*.aula.de', 'eduplaces.de', '*.eduplaces.de'],
  },
  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
    backgroundColor: '#000000',
    allowsLinkPreview: true,
    scheme: 'aula',
    // Must stay false: true restricts the webview to Info.plist WKAppBoundDomains
    // (not set), which would block the in-webview SSO redirect to the IdP.
    limitsNavigationsToAppBoundDomains: false,
  },
  plugins: {
    Keyboard: {
      resizeOnFullScreen: true,
    },
  },
};

export default config;
