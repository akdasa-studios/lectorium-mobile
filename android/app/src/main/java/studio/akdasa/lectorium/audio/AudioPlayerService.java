package studio.akdasa.lectorium.audio;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

import java.util.HashMap;

public class AudioPlayerService extends Service {
    private static final String TAG = "AudioPlayerService";
    private final IBinder serviceBinder = new AudioPlayerServiceBinder();
    private static boolean isRunning = false;
    private HashMap<String, AudioSource> audioSources = new HashMap<>();

    public boolean createAudioSource(AudioSource audioSource) {
        if (audioSources.containsKey(audioSource.id)) {
            Log.w(TAG, String.format("There is already an audio source with ID %s", audioSource.id));
            return false;
        }

        Log.i(TAG, String.format("Initializing audio source ID %s (%s)", audioSource.id, audioSource.source));

        audioSource.setServiceOwner(this);
        audioSources.put(audioSource.id, audioSource);
        return true;
    }

    public void initializeAudioSource(String audioSourceId) {
        getAudioSource(audioSourceId).initialize(this);
    }

    public boolean audioSourceExists(String audioSourceId) {
        return audioSources.containsKey(audioSourceId);
    }

    public long getDuration(String audioSourceId) {
        return getAudioSource(audioSourceId).getDuration();
    }

    public float getCurrentTime(String audioSourceId) {
        return getAudioSource(audioSourceId).getCurrentTime() / 1000;
    }

    public void play(String audioSourceId) {
        getAudioSource(audioSourceId).play();
    }

    public void pause(String audioSourceId) {
        getAudioSource(audioSourceId).pause();
    }

    public void seek(String audioSourceId, long position) {
        getAudioSource(audioSourceId).seek(position);
    }

    public void stop(String audioSourceId) {
        getAudioSource(audioSourceId).stop();
    }

    public void setRate(String audioSourceId, float rate) {
        getAudioSource(audioSourceId).setRate(rate);
    }

    public boolean isPlaying(String audioSourceId) {
        return getAudioSource(audioSourceId).isPlaying();
    }

    public void destroyAudioSource(String audioSourceId) {
        AudioSource audioSource = getAudioSource(audioSourceId);
        audioSource.releasePlayer();

        audioSources.remove(audioSourceId);

        if (audioSources.isEmpty()) {
            stopService();
        }
    }

    public boolean isRunning() {
        return isRunning;
    }

    public static Intent newIntent(Context context) {
        return new Intent(context, AudioPlayerService.class);
    }

    public class AudioPlayerServiceBinder extends Binder {
        public AudioPlayerService getService() {
            return AudioPlayerService.this;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return serviceBinder;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        isRunning = true;
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        for (AudioSource audioSource : audioSources.values()) {
            audioSource.releasePlayer();
        }

        audioSources.clear();
        isRunning = false;

        super.onDestroy();
    }

    private AudioSource getAudioSource(String id) {
        AudioSource source = audioSources.get(id);

        if (source == null) {
            Log.w(TAG, String.format("Audio source with ID %s was not found.", id));
        }

        return source;
    }

    private void stopService() {
        stopForeground(true);
        stopSelf();
        isRunning = false;
    }
}
