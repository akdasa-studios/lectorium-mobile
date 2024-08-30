package studio.akdasa.lectorium.audio;

import android.media.MediaPlayer;
import android.os.Handler;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

public class MediaStateChangeNotifier {
    private PluginCall callback;
    private String currentTrackId;

    private final MediaPlayer player;
    private final Handler handler = new Handler();
    private final Runnable runnable = new Runnable() {
        @Override
        public void run() {
            update();
            handler.postDelayed(this, 1000);
        }
    };

    public MediaStateChangeNotifier(
            MediaPlayer player
    ) {
        this.player = player;
    }

    public void run() {
        this.runnable.run();
    }

    public void update() {
        if (player == null || callback  == null) { return; }

        JSObject callPayload = new JSObject();
        if (currentTrackId != null) {
            callPayload.put("position", player.getCurrentPosition() / 1000);
            callPayload.put("playing", player.isPlaying());
            callPayload.put("duration", player.getDuration() / 1000);
            callPayload.put("trackId", currentTrackId);
        } else {
            callPayload.put("position", 0);
            callPayload.put("playing", false);
            callPayload.put("duration", 0);
            callPayload.put("trackId", null);
        }
        callback.resolve(callPayload);
    }

    public void setCurrentTrackId(String value) {
        currentTrackId = value;
    }

    public void setCallback(PluginCall value) {
        callback = value;
    }
}
