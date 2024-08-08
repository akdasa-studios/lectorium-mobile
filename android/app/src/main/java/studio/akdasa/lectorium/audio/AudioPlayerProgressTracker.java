package studio.akdasa.lectorium.audio;

import android.os.Handler;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.google.android.exoplayer2.ExoPlayer;

public class ProgressTracker implements Runnable {
    private final ExoPlayer player;
    private PluginCall call;
    private final Handler handler = new Handler();

    public ProgressTracker(
        ExoPlayer player
    ) {
        this.player = player;
        handler.post(this);
    }

    public void run() {
        if (this.call != null) {
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
}
