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
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import com.getcapacitor.PluginCall;

import studio.akdasa.lectorium.audio.mediaSession.MediaSessionCallback;
import studio.akdasa.lectorium.audio.mediaSession.MediaSessionController;
import studio.akdasa.lectorium.audio.mediaStateNotifications.MediaSessionMediaStateNotifier;
import studio.akdasa.lectorium.audio.mediaStateNotifications.MediaStateNotificationService;
import studio.akdasa.lectorium.audio.mediaStateNotifications.PluginCallMediaStateNotifier;


public final class AudioPlayerService extends Service {
    private static final String CHANNEL_ID = "MediaPlaybackChannel";
    private static final int NOTIFICATION_ID = 1;

    private MediaSessionController mediaSessionController;

    private MediaPlayer mediaPlayer;
    private MediaStateNotificationService mediaStateNotificationService;
    private NotificationManager notificationManager;

    @Override
    public void onCreate() {
        super.onCreate();
        Context context = getApplicationContext();
        mediaPlayer = new MediaPlayer();
        mediaStateNotificationService = new MediaStateNotificationService(mediaPlayer);

        // Create notification channel
        notificationManager = getSystemService(NotificationManager.class);
        notificationManager.createNotificationChannel(
                new NotificationChannel(
                        CHANNEL_ID, "Media Playback", NotificationManager.IMPORTANCE_LOW)
        );

        // Create media session controller
        mediaSessionController = new MediaSessionController(
                context,
                notificationManager,
                new MediaSessionCallback(this)
        );

        // Set media state change notification service
        mediaStateNotificationService.addNotifier(new MediaSessionMediaStateNotifier(mediaSessionController));
        mediaStateNotificationService.run();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startForeground(NOTIFICATION_ID, createNotification());
        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return new AudioPlayerServiceBinder(this);
    }

    @Override
    public void onDestroy() {
        if (mediaPlayer != null) {
            mediaPlayer.release();
        }

        this.stopForeground(true);
        this.stopSelf();
        notificationManager.deleteNotificationChannel(CHANNEL_ID);
        super.onDestroy();
    }

    MediaPlayer getMediaPlayer() {
        return mediaPlayer;
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
            mediaStateNotificationService.setCurrentTrackId(trackId);
            mediaStateNotificationService.update();
            mediaSessionController.setMediaInfo(trackTitle, trackArtist, mediaPlayer.getDuration());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void play() {
        if (!mediaPlayer.isPlaying()) {
            mediaPlayer.start();
            mediaStateNotificationService.update();
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
        mediaStateNotificationService.update();
    }

    public void seek(long position) {
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            mediaPlayer.seekTo(position, SEEK_PREVIOUS_SYNC);
            mediaStateNotificationService.update();
        }
    }

    public void stop() {
        mediaPlayer.stop();
        mediaPlayer.reset();
        mediaStateNotificationService.setCurrentTrackId(null);
        mediaSessionController.setPlaybackState(PlaybackState.STATE_STOPPED, 0);
        mediaStateNotificationService.update();
    }

    public void setOnProgressChangeCall(PluginCall call) {
        mediaStateNotificationService.addNotifier(new PluginCallMediaStateNotifier(call));
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