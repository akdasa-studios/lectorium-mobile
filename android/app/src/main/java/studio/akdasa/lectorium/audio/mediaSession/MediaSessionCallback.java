package studio.akdasa.lectorium.audio.mediaSession;

import android.support.v4.media.session.MediaSessionCompat;

import studio.akdasa.lectorium.audio.AudioPlayerService;

public final class MediaSessionCallback extends MediaSessionCompat.Callback {
    private final AudioPlayerService service;

    public MediaSessionCallback(AudioPlayerService service) {
        this.service = service;
    }
    
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
