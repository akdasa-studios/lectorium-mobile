package studio.akdasa.lectorium.audio;

import android.os.Binder;

public final class AudioPlayerServiceBinder extends Binder {
    private final AudioPlayerService instance;

    public AudioPlayerServiceBinder(AudioPlayerService instance) {
        this.instance = instance;
    }

    AudioPlayerService getService() {
        return instance;
    }
}
