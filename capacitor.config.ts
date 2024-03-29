import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.akdasa.lectorium',
  appName: 'lectorium',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
