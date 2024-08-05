package studio.akdasa.lectorium.audio;

import android.content.Context;

import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.MediaMetadata;
import com.google.android.exoplayer2.audio.AudioAttributes;

public class AudioSource {
    public String id;
    public String source;
    public String friendlyTitle;

    public String onPlaybackStatusChangeCallbackId;
    public String onReadyCallbackId;
    public String onEndCallbackId;
    private AudioPlayerService serviceOwner;
    private AudioPlayerPlugin pluginOwner;
    private ExoPlayer player;
    private boolean isPlaying = false;
    private boolean isStopped = true;

    public AudioSource(
            AudioPlayerPlugin pluginOwner,
            String id,
            String source,
            String friendlyTitle
    ) {
        this.pluginOwner = pluginOwner;
        this.id = id;
        this.source = source;
        this.friendlyTitle = friendlyTitle;
    }

    public void initialize(Context context) {
        if (player != null) {
            return;
        }

        isPlaying = false;
        isStopped = true;

        player = new ExoPlayer.Builder(context)
                .setAudioAttributes(new AudioAttributes.Builder()
                        .setUsage(C.USAGE_MEDIA)
                        .setContentType(C.AUDIO_CONTENT_TYPE_SPEECH)
                        .build(), true)
                .setWakeMode(C.WAKE_MODE_NETWORK)
                .build();
        player.setMediaItem(buildMediaItem());
        player.addListener(new PlayerEventListener(pluginOwner, this));
        player.prepare();
    }

    public long getDuration() {
        long duration = player.getDuration();

        if (duration == C.TIME_UNSET) {
            return -1;
        }

        return duration;
    }

    public long getCurrentTime() {
        return player.getCurrentPosition();
    }

    public void play() {
        isPlaying = true;
        isStopped = false;

        player.play();
    }

    public void pause() {
        isPlaying = false;
        isStopped = false;

        player.pause();
    }

    public void seek(long position) {
        player.seekTo(position);
    }

    public void stop() {
        isStopped = true;
        isPlaying = false;

        player.pause();
        player.seekToDefaultPosition();
    }

    public void stopThroughService() {
        serviceOwner.stop(id);
    }

    public void setRate(float rate) {
        player.setPlaybackSpeed(rate);
    }

    public void setOnEnd(String callbackId) {
        onEndCallbackId = callbackId;
    }

    public boolean isPlaying() {
        if (player == null) {
            return false;
        }

        return isPlaying;
    }

    public boolean isStopped() {
        return isStopped;
    }

    public void setIsPlaying(boolean isPlaying) {
        this.isPlaying = isPlaying;
    }

    public void setIsStopped(boolean isStopped) {
        this.isStopped = isStopped;
    }

    public void setServiceOwner(AudioPlayerService service) {
        this.serviceOwner = service;
    }

    public ExoPlayer getPlayer() {
        return player;
    }

    public void releasePlayer() {
        if (isInitialized()) {
            player.release();
            player = null;
        }
    }

    public boolean isInitialized() {
        return player != null;
    }

    private MediaItem buildMediaItem() {
        return new MediaItem.Builder()
                .setMediaMetadata(new MediaMetadata.Builder()
                        .setArtist("")
                        .setTitle(friendlyTitle)
                        .build())
                .setUri(source)
                .build();
    }
}
