package studio.akdasa.lectorium.audio;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.audio.AudioAttributes;
import com.google.android.exoplayer2.ui.DefaultMediaDescriptionAdapter;
import com.google.android.exoplayer2.ui.PlayerNotificationManager;

import com.getcapacitor.PluginCall;


import studio.akdasa.lectorium.MainActivity;

public class AudioPlayerService extends Service {
    private static final String TAG = "AudioPlayerService";
    public static final String PLAYBACK_CHANNEL_ID = "playback_channel";
    public static final int PLAYBACK_NOTIFICATION_ID = 1;

    private final IBinder serviceBinder = new AudioPlayerServiceBinder();
    private ExoPlayer player;
    private final AudioPlayerProgressTracker progressTracker = new AudioPlayerProgressTracker();
    private PlayerNotificationManager playerNotificationManager;
    
    public void createAudioSource(String audioSource) {
        if (player == null) {
            player = new ExoPlayer.Builder(this)
                    .setAudioAttributes(new AudioAttributes.Builder()
                            .setUsage(C.USAGE_MEDIA)
                            .setContentType(C.AUDIO_CONTENT_TYPE_SPEECH)
                            .build(), true)
                    .setWakeMode(C.WAKE_MODE_NETWORK)
                    .build();
            playerNotificationManager.setPlayer(player);
            progressTracker.setPlayer(player);
        }

        player.setMediaItem(MediaItem.fromUri(audioSource));
        player.prepare();
    }

    public void play() {
        player.play();
    }

    public void pause() {
        player.pause();
    }

    public void seek(long position) {
        player.seekTo(position);
    }

    public void stop() {
        clearNotification();
        stopService();
        player.stop();
    }

    public static Intent newIntent(Context context) {
        return new Intent(context, AudioPlayerService.class);
    }

    public void addOnStatusChangeListener(PluginCall call) {
        this.progressTracker.setCall(call);
    }

    public class AudioPlayerServiceBinder extends Binder {
        public AudioPlayerService getService() {
            return AudioPlayerService.this;
        }
    }

    @Override
    public void onCreate() {
        Log.i(TAG, "Service being created");

        Context appContext = getApplication().getApplicationContext();

        playerNotificationManager = new PlayerNotificationManager.Builder(
            appContext,
            PLAYBACK_NOTIFICATION_ID,
            PLAYBACK_CHANNEL_ID)
            .setMediaDescriptionAdapter(
                new DefaultMediaDescriptionAdapter(PendingIntent.getService(
                    appContext,
                    0,
                    new Intent(appContext, MainActivity.class),
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                )))
            .setNotificationListener(
                new PlayerNotificationManager.NotificationListener() {
                    @Override
                    public void onNotificationCancelled(int notificationId, boolean dismissedByUser) {
                        Log.i(TAG, "Notification cancelled, stopping service");
                        stopService();
                    }

                    @Override
                    public void onNotificationPosted(int notificationId, Notification notification, boolean ongoing) {
                        if (ongoing) {
                            // Make sure the service will not get destroyed while playing media
                            Log.i(TAG, "Notification posted, starting foreground");
                            startForeground(notificationId, notification);
                        } else {
                            // Make notification cancellable
                            Log.i(TAG, "Notification posted, stopping foreground");
                            stopForeground(false);
                        }
                    }
                }
            )
            .build();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return serviceBinder;
    }

    @Override
    public void onDestroy() {
        Log.i(TAG, "Service being destroyed");
        clearNotification();
        playerNotificationManager = null;

        player.release();
        player = null;

        super.onDestroy();
    }

    private void clearNotification() {
        if (playerNotificationManager != null) {
            Log.i(TAG, "Notification: Setting player to null.");
            playerNotificationManager.setPlayer(null);
        }
    }

    private void stopService() {
        stopForeground(true);
        stopSelf();
    }
}
