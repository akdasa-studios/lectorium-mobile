import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'studio.akdasa.lectorium',
  appName: 'lectorium',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
