package studio.akdasa.lectorium.audio;

import android.media.session.PlaybackState;
import android.os.Handler;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

public class MediaStateChangeNotifier {
    private PluginCall callback;
    private String currentTrackId;

    private final AudioPlayerService service;
    private final Handler handler = new Handler();
    private final Runnable runnable = new Runnable() {
        @Override
        public void run() {
            update();
            handler.postDelayed(this, 1000);
        }
    };

    public MediaStateChangeNotifier(
            AudioPlayerService service
    ) {
        this.service = service;
    }

    public void run() {
        this.runnable.run();
    }

    public void update() {
        if (service.mediaPlayer == null || callback  == null) { return; }

        JSObject callPayload = new JSObject();
        if (currentTrackId != null) {
            callPayload.put("position", service.mediaPlayer.getCurrentPosition() / 1000);
            callPayload.put("playing", service.mediaPlayer.isPlaying());
            callPayload.put("duration", service.mediaPlayer.getDuration() / 1000);
            callPayload.put("trackId", currentTrackId);
            service.mediaSessionController.setPlaybackState(
                    service.mediaPlayer.isPlaying() ? PlaybackState.STATE_PLAYING : PlaybackState.STATE_PAUSED,
                    service.mediaPlayer.getCurrentPosition());
        } else {
            callPayload.put("position", 0);
            callPayload.put("playing", false);
            callPayload.put("duration", 0);
            callPayload.put("trackId", null);
            service.mediaSessionController.setPlaybackState(PlaybackState.STATE_STOPPED, 0);
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
