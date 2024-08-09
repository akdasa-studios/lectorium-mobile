package studio.akdasa.lectorium.audio;

import android.os.Handler;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.google.android.exoplayer2.ExoPlayer;

public class AudioPlayerProgressTracker implements Runnable {
    private ExoPlayer player;
    private PluginCall call;
    private final Handler handler = new Handler();

    public AudioPlayerProgressTracker() {
        handler.post(this);
    }

    public void run() {
        if (this.call != null && this.player != null) {
            JSObject callPayload = new JSObject();
            callPayload.put("position", this.player.getCurrentPosition() / 1000);
            callPayload.put("playing", this.player.isPlaying());
            callPayload.put("duration", this.player.getDuration() / 1000);
            this.call.resolve(callPayload);
        }

        handler.postDelayed(this, 1000);
    }

    public void setCall(PluginCall call) {
        this.call = call;
    }

    public void setPlayer(ExoPlayer player) {
        this.player = player;
    }
}
