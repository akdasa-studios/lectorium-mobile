package studio.akdasa.lectorium;


import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import studio.akdasa.lectorium.audio.AudioPlayerPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AudioPlayerPlugin.class);

        super.onCreate(savedInstanceState);
    }
}
