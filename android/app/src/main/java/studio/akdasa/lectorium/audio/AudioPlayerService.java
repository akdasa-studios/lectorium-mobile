package studio.akdasa.lectorium.audio;

import static android.media.MediaPlayer.SEEK_PREVIOUS_SYNC;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.media.session.PlaybackState;
import android.os.Binder;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import com.getcapacitor.PluginCall;

public class AudioPlayerService extends Service {
    private static final String CHANNEL_ID = "MediaPlaybackChannel";
    private static final int NOTIFICATION_ID = 1;

    private final IBinder binder = new LocalBinder();
    public MediaPlayer mediaPlayer;
    private MediaStateChangeNotifier mediaStateChangeNotifier;
    public MediaSessionController mediaSessionController;
    public NotificationChannel notificationChannel;
    public NotificationManager notificationManager;
    public Context context;

    public class LocalBinder extends Binder {
        AudioPlayerService getService() {
            return AudioPlayerService.this;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        context = getApplicationContext();
        mediaPlayer = new MediaPlayer();
        mediaStateChangeNotifier = new MediaStateChangeNotifier(this);

        notificationChannel = new NotificationChannel(CHANNEL_ID, "Media Playback", NotificationManager.IMPORTANCE_LOW);
        notificationManager = getSystemService(NotificationManager.class);
        notificationManager.createNotificationChannel(notificationChannel);

        mediaSessionController = new MediaSessionController(this);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startForeground(NOTIFICATION_ID, createNotification());
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public void onDestroy() {
        if (mediaPlayer != null) {
            mediaPlayer.release();
            mediaPlayer = null;
        }
        super.onDestroy();
    }

    public void open(
            String trackId,
            String url,
            String trackTitle,
            String trackArtist
    ) {
        try {
            mediaPlayer.reset();
            mediaPlayer.setDataSource(url);
            mediaPlayer.prepare();
            mediaStateChangeNotifier.setCurrentTrackId(trackId);
            mediaStateChangeNotifier.update();
            mediaSessionController.setMediaInfo(trackTitle, trackArtist, mediaPlayer.getDuration());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void play() {
        if (!mediaPlayer.isPlaying()) {
            mediaPlayer.start();
            mediaStateChangeNotifier.update();
            mediaSessionController.setPlaybackState(PlaybackState.STATE_PLAYING, 0);
        }
    }

    public void togglePause() {
        if (mediaPlayer.isPlaying()) {
            mediaPlayer.pause();
            mediaSessionController.setPlaybackState(PlaybackState.STATE_PAUSED, mediaPlayer.getCurrentPosition());
        } else {
            mediaPlayer.start();
            mediaSessionController.setPlaybackState(PlaybackState.STATE_PLAYING, mediaPlayer.getCurrentPosition());
        }
        mediaStateChangeNotifier.update();
    }

    public void seek(long position) {
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            mediaPlayer.seekTo(position, SEEK_PREVIOUS_SYNC);
            mediaStateChangeNotifier.update();
        }
    }

    public void stop() {
        mediaPlayer.stop();
        mediaPlayer.reset();
        mediaStateChangeNotifier.setCurrentTrackId(null);
        mediaSessionController.setPlaybackState(PlaybackState.STATE_STOPPED, 0);
        mediaStateChangeNotifier.update();
    }

    public void setOnProgressChangeCall(PluginCall call) {
        this.mediaStateChangeNotifier.setCallback(call);
        this.mediaStateChangeNotifier.run();
    }

    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, getApplicationContext().getClass());
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Media Playback")
                .setContentText("Playing media")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(pendingIntent)
                .build();
    }
}