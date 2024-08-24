package studio.akdasa.lectorium.audio;

import static android.media.MediaPlayer.SEEK_PREVIOUS_SYNC;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.os.Binder;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.media.session.MediaButtonReceiver;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

import java.io.IOException;

public class AudioPlayerService extends Service implements MediaPlayer.OnPreparedListener, MediaPlayer.OnCompletionListener, MediaPlayer.OnErrorListener {

    public static final String ACTION_OPEN = "com.example.plugin.ACTION_OPEN";
    public static final String ACTION_PLAY = "com.example.plugin.ACTION_PLAY";
    public static final String ACTION_TOGGLE_PAUSE = "com.example.plugin.ACTION_TOGGLE_PAUSE";
    public static final String ACTION_SEEK = "com.example.plugin.ACTION_SEEK";
    public static final String ACTION_STOP = "com.example.plugin.ACTION_STOP";

    private static final String CHANNEL_ID = "AudioPlayerChannel";
    private static final int NOTIFICATION_ID = 1;

    private MediaPlayer mediaPlayer;
    private MediaSessionCompat mediaSession;

    private PluginCall onProgress;
    private Handler handler = new Handler();
    private Runnable runnable = new Runnable() {
        @Override
        public void run() {
            if (mediaPlayer == null) { return; }
            if (onProgress == null) { return; }

            JSObject callPayload = new JSObject();
            callPayload.put("position", mediaPlayer.getCurrentPosition() / 1000);
            callPayload.put("playing", mediaPlayer.isPlaying());
            callPayload.put("duration", mediaPlayer.getDuration() / 1000);
            callPayload.put("trackId", currentTrackId);
            onProgress.resolve(callPayload);

            handler.postDelayed(this, 1000);
        }
    };

    private String currentUrl;
    private String currentTitle;
    private String currentAuthor;
    private String currentTrackId;


    private final IBinder binder = new LocalBinder();

    public class LocalBinder extends Binder {
        AudioPlayerService getService() {
            return AudioPlayerService.this;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        mediaPlayer = new MediaPlayer();
        mediaPlayer.setOnPreparedListener(this);
        mediaPlayer.setOnCompletionListener(this);
        mediaPlayer.setOnErrorListener(this);

        mediaSession = new MediaSessionCompat(this, "AudioPlayerService");
        mediaSession.setCallback(new MediaSessionCallback());
        mediaSession.setActive(true);

        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Background Audio Channel",
                NotificationManager.IMPORTANCE_LOW
        );
        channel.setDescription("Channel for background audio playback");
        NotificationManager notificationManager = getSystemService(NotificationManager.class);
        notificationManager.createNotificationChannel(channel);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        MediaButtonReceiver.handleIntent(mediaSession, intent);

        if (intent != null && intent.getAction() != null) {
            switch (intent.getAction()) {
                case ACTION_OPEN:
                    String trackId = intent.getStringExtra("trackId");
                    String url = intent.getStringExtra("url");
                    String title = intent.getStringExtra("title");
                    String author = intent.getStringExtra("author");
                    if (url != null) { openAudio(trackId, url, title, author); }
                    break;
                case ACTION_PLAY:
                    resumeAudio();
                    break;
                case ACTION_TOGGLE_PAUSE:
                    togglePauseAudio();
                    break;
                case ACTION_SEEK:
                    long pos = intent.getLongExtra("position", 0);
                    seekAudio(pos);
                    break;
                case ACTION_STOP:
                    stopAudio();
                    break;
            }
        }
        return START_STICKY;
    }

    private void openAudio(String trackId, String url, String title, String author) {
        if (url.equals(currentUrl) && mediaPlayer.isPlaying()) {
            return;
        }

        currentUrl = url;
        currentTitle = title;
        currentAuthor = author;
        currentTrackId = trackId;

        try {
            mediaPlayer.reset();
            mediaPlayer.setAudioAttributes(
                    new AudioAttributes.Builder()
                            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                            .setUsage(AudioAttributes.USAGE_MEDIA)
                            .build()
            );
            mediaPlayer.setDataSource(url);
            mediaPlayer.prepare();

            updateMetadata();
            updatePlaybackState(PlaybackStateCompat.STATE_BUFFERING);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void togglePauseAudio() {
        if (mediaPlayer.isPlaying()) {
            pauseAudio();
        } else {
            resumeAudio();
        }
    }

    private void pauseAudio() {
        if (mediaPlayer.isPlaying()) {
            mediaPlayer.pause();
            updatePlaybackState(PlaybackStateCompat.STATE_PAUSED);
        }
    }

    private void resumeAudio() {
        if (!mediaPlayer.isPlaying()) {
            mediaPlayer.start();
            updatePlaybackState(PlaybackStateCompat.STATE_PLAYING);
        }
    }

    private void seekAudio(long position) {
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            mediaPlayer.seekTo(position, SEEK_PREVIOUS_SYNC);
        }
    }

    private void stopAudio() {
        mediaPlayer.stop();
        mediaPlayer.reset();
        currentUrl = null;
        currentTrackId = null;
        updatePlaybackState(PlaybackStateCompat.STATE_STOPPED);
        stopForeground(true);
        stopSelf();
    }

    private void updateMetadata() {
        MediaMetadataCompat.Builder metadataBuilder = new MediaMetadataCompat.Builder()
                .putString(MediaMetadataCompat.METADATA_KEY_TITLE, currentTitle)
                .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, currentAuthor);
//                .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, mediaPlayer.getDuration());

        // You can add album art here if available
        // Bitmap albumArt = BitmapFactory.decodeResource(getResources(), R.drawable.album_art);
        // metadataBuilder.putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, albumArt);

        mediaSession.setMetadata(metadataBuilder.build());
    }

    private void updatePlaybackState(int state) {
        if (state == PlaybackStateCompat.STATE_PLAYING) {
            long l = mediaPlayer.getDuration();
            MediaMetadataCompat.Builder metadataBuilder = new MediaMetadataCompat.Builder()
                    .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, l);
            mediaSession.setMetadata(metadataBuilder.build());
        }

        PlaybackStateCompat.Builder stateBuilder = new PlaybackStateCompat.Builder()
                .setActions(PlaybackStateCompat.ACTION_PLAY |
                        PlaybackStateCompat.ACTION_PAUSE |
                        PlaybackStateCompat.ACTION_STOP |
                        PlaybackStateCompat.ACTION_PLAY_PAUSE)
                .setState(state, mediaPlayer.getCurrentPosition(), 1.0f);
        mediaSession.setPlaybackState(stateBuilder.build());

        updateNotification();
    }

    private Notification createNotification() {
        Intent intent = new Intent(this, AudioPlayerService.class);
        PendingIntent pendingIntent = PendingIntent.getService(this, 0, intent, PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(currentTitle)
                .setContentText(currentAuthor)
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(pendingIntent)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setOnlyAlertOnce(true)
                .setOngoing(true);

        // Add media control actions
//        builder.addAction(new NotificationCompat.Action(android.R.drawable.ic_media_previous, "Previous", MediaButtonReceiver.buildMediaButtonPendingIntent(this, PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS)));
        if (mediaPlayer.isPlaying()) {
            builder.addAction(new NotificationCompat.Action(android.R.drawable.ic_media_pause, "Pause", MediaButtonReceiver.buildMediaButtonPendingIntent(this, PlaybackStateCompat.ACTION_PAUSE)));
        } else {
            builder.addAction(new NotificationCompat.Action(android.R.drawable.ic_media_play, "Play", MediaButtonReceiver.buildMediaButtonPendingIntent(this, PlaybackStateCompat.ACTION_PLAY)));
        }
//        builder.addAction(new NotificationCompat.Action(android.R.drawable.ic_media_next, "Next", MediaButtonReceiver.buildMediaButtonPendingIntent(this, PlaybackStateCompat.ACTION_SKIP_TO_NEXT)));

        builder.setStyle(new androidx.media.app.NotificationCompat.MediaStyle()
                .setMediaSession(mediaSession.getSessionToken())
                .setShowActionsInCompactView(0));

        return builder.build();
    }

    private void updateNotification() {
        Notification notification = createNotification();
        startForeground(NOTIFICATION_ID, notification);
    }

    @Override
    public void onPrepared(MediaPlayer mp) {
        mp.start();
        updatePlaybackState(PlaybackStateCompat.STATE_PLAYING);
    }

    @Override
    public void onCompletion(MediaPlayer mp) {
        stopAudio();
    }

    @Override
    public boolean onError(MediaPlayer mp, int what, int extra) {
        stopAudio();
        return true;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mediaPlayer != null) {
            mediaPlayer.release();
            mediaPlayer = null;
        }
        if (mediaSession != null) {
            mediaSession.release();
        }
    }

    private class MediaSessionCallback extends MediaSessionCompat.Callback {
        @Override
        public void onPlay() {
            resumeAudio();
        }

        @Override
        public void onPause() {
            pauseAudio();
        }

        @Override
        public void onStop() {
            stopAudio();
        }
    }

    public void setCall(PluginCall call) {
        this.onProgress = call;
        handler.postDelayed(runnable, 1000);
    }
}