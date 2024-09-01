package studio.akdasa.lectorium.audio;

import android.app.Notification;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;

import androidx.core.app.NotificationCompat;
import androidx.media.session.MediaButtonReceiver;

public class MediaSessionController {
    private final MediaSessionCompat mediaSession;
    private final AudioPlayerService service;

    public MediaSessionController(
            AudioPlayerService service
    ) {
        this.service = service;
        this.mediaSession = new MediaSessionCompat(service.context, "MediaSessionPlugin");
        this.mediaSession.setCallback(new MediaSessionCallback());
        this.mediaSession.setActive(true);
    }

    public void setMediaInfo(
            String title,
            String artist,
            long duration
    ) {
        mediaSession.setMetadata(new MediaMetadataCompat.Builder()
                .putString(MediaMetadataCompat.METADATA_KEY_TITLE, title)
                .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, artist)
                .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, duration)
                .build());
        updateNotification();
    }

    public void setPlaybackState(
            int playbackState,
            long position
    ) {
        mediaSession.setPlaybackState(new PlaybackStateCompat.Builder()
                .setState(playbackState, position, 1.0f)
                .setActions(
                        PlaybackStateCompat.ACTION_PLAY |
                        PlaybackStateCompat.ACTION_PAUSE)
                .build());
        updateNotification();
    }

    private void updateNotification() {
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(
                service.context, "MediaPlaybackChannel");
        MediaMetadataCompat metadata = mediaSession.getController().getMetadata();
        PlaybackStateCompat playbackState = mediaSession.getController().getPlaybackState();
        int appIconResId = service.context.getApplicationInfo().icon;
        if (metadata == null || playbackState == null) { return; }

        notificationBuilder
                // .setDeleteIntent(MediaButtonReceiver.buildMediaButtonPendingIntent(service.context, PlaybackStateCompat.ACTION_STOP))
                .setContentTitle(metadata.getString(MediaMetadataCompat.METADATA_KEY_TITLE))
                .setContentText(metadata.getString(MediaMetadataCompat.METADATA_KEY_ARTIST))
                .setSubText(metadata.getString(MediaMetadataCompat.METADATA_KEY_ALBUM))
                .setSmallIcon(appIconResId)
                .setContentIntent(mediaSession.getController().getSessionActivity())
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setOngoing(true)
                .setAutoCancel(false)
                .addAction(new NotificationCompat.Action(
                        playbackState.getState() == PlaybackStateCompat.STATE_PLAYING ? android.R.drawable.ic_media_pause : android.R.drawable.ic_media_play,
                        playbackState.getState() == PlaybackStateCompat.STATE_PLAYING ? "Pause" : "Play",
                        MediaButtonReceiver.buildMediaButtonPendingIntent(service.context, PlaybackStateCompat.ACTION_PLAY_PAUSE)))
                .setStyle(new androidx.media.app.NotificationCompat.MediaStyle()
                        .setMediaSession(mediaSession.getSessionToken())
                        .setShowActionsInCompactView(0));

        Notification notification = notificationBuilder.build();
        service.notificationManager.notify(1, notification);
    }


    private class MediaSessionCallback extends MediaSessionCompat.Callback {
        @Override
        public void onPlay() {
            service.play();
        }

        @Override
        public void onPause() {
            service.togglePause();
        }

        @Override
        public void onStop() {
            service.stop();
        }
    }
}
