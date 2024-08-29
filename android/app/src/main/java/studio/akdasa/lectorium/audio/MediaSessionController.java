package studio.akdasa.lectorium.audio;

import android.content.Context;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;

public class MediaSessionController {
    private final MediaSessionCompat mediaSession;

    public MediaSessionController(Context context) {
        mediaSession = new MediaSessionCompat(context, "MediaSessionPlugin");
        mediaSession.setActive(true);
    }

    public void setMediaInfo(
            String title,
            String artist,
            String album,
            long duration
    ) {
        MediaMetadataCompat.Builder metadataBuilder = new MediaMetadataCompat.Builder()
                .putString(MediaMetadataCompat.METADATA_KEY_TITLE, title)
                .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, artist)
                .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, album)
                .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, duration);
        mediaSession.setMetadata(metadataBuilder.build());
    }

    public void setPlaybackState(
            int playbackState,
            long position
    ) {
        PlaybackStateCompat.Builder stateBuilder = new PlaybackStateCompat.Builder()
                .setState(playbackState, position, 1.0f);

        mediaSession.setPlaybackState(stateBuilder.build());
    }
}
