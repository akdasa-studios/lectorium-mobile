import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'studio.akdasa.lectorium',
  appName: 'Listen to Sadhu',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
