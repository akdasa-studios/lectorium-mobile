package studio.akdasa.lectorium;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import studio.akdasa.lectorium.audio.AudioPlayerPlugin;
import studio.akdasa.lectorium.downloader.BackgroundDownloader;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AudioPlayerPlugin.class);
        registerPlugin(BackgroundDownloader.class);

        super.onCreate(savedInstanceState);
    }
}
