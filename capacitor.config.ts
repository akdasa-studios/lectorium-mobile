import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'studio.akdasa.lectorium',
  appName: 'Listen to Sadhu',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/Database',
      androidDatabaseLocation: 'default',
    },
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      // backgroundColor: "#5D636F",
      // androidSplashResourceName: "splash",
      // androidScaleType: "CENTER_CROP",
      // showSpinner: true,
      // androidSpinnerStyle: "large",
      // iosSpinnerStyle: "small",
      // spinnerColor: "#999999",
      // splashFullScreen: true,
      // splashImmersive: true,
      // layoutName: "launch_screen",
      // useDialog: true,
    },
  }
};

export default config;
