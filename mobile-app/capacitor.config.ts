import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nspireapp',
  appName: 'NSPIRE INSPECTION (Public)',
  webDir: 'www',
  server: {
    // App loads the live production site directly — no local bundle, so
    // every website deploy is reflected in the app without a new store build.
    url: 'https://nspireinspectionapp.com',
    cleartext: false
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
