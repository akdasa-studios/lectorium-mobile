package studio.akdasa.lectorium.audio.mediaStateNotifications;

import android.media.MediaPlayer;
import android.os.Handler;

import java.util.ArrayList;
import java.util.List;


public final class MediaStateNotificationService {
    private final List<IMediaStateNotifier> notifiers = new ArrayList<>();
    private final MediaPlayer mediaPlayer;

    private final Handler handler = new Handler();
    private final Runnable runnable = new Runnable() {
        @Override
        public void run() {
            update();
            handler.postDelayed(this, 1000);
        }
    };
    private String currentTrackId;

    public MediaStateNotificationService(
            MediaPlayer mediaPlayer
    ) {
        this.mediaPlayer = mediaPlayer;
    }

    public void run() {
        this.runnable.run();
    }

    public void update() {
        for (IMediaStateNotifier notifier : notifiers) {
            notifier.send(
                    new MediaState(
                            currentTrackId,
                            mediaPlayer.isPlaying() ? mediaPlayer.getCurrentPosition() : 0,
                            mediaPlayer.isPlaying() ? mediaPlayer.getDuration() : 0,
                            mediaPlayer.isPlaying()));
        }
    }

    public void setCurrentTrackId(String value) {
        currentTrackId = value;
    }

    public void addNotifier(IMediaStateNotifier notifier) {
        notifiers.add(notifier);
    }
}
