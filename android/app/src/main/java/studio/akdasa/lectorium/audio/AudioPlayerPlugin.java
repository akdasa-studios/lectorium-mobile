package studio.akdasa.lectorium.audio;

import android.content.Context;
import android.content.Intent;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;


@CapacitorPlugin(name="AudioPlayer")
public final class AudioPlayerPlugin extends Plugin {
    private final AudioPlayerServiceConnection audioPlayerServiceConnection = new AudioPlayerServiceConnection();

    /* -------------------------------------------------------------------------- */
    /*                             Lifecycle methods                              */
    /* -------------------------------------------------------------------------- */

    @Override
    public void load() {
        Intent intent = new Intent(getContext(), AudioPlayerService.class);
        getContext().bindService(intent, audioPlayerServiceConnection, Context.BIND_AUTO_CREATE);
        getContext().startForegroundService(intent);
    }

    @Override
    protected void handleOnDestroy() {
        // If audio service started and playing, just keep it playing.
        boolean isConnectedAndPlaying =
                audioPlayerServiceConnection.isConnected() &&
                audioPlayerServiceConnection.getService().getMediaPlayer().isPlaying();
        if (isConnectedAndPlaying) { return; }

        // Stop audio player service if it is not playing
        Intent intent = new Intent(getContext(), AudioPlayerService.class);
        getContext().unbindService(audioPlayerServiceConnection);
        getContext().stopService(intent);
        super.handleOnDestroy();
    }

    
    /* -------------------------------------------------------------------------- */
    /*                               Plugin methods                               */
    /* -------------------------------------------------------------------------- */

    @PluginMethod
    public void open(PluginCall call) {
        String url = call.getString("url");
        String trackId = call.getString("trackId");
        String trackTitle = call.getString("title");
        String trackArtist = call.getString("author");

        if (url == null) {
            call.reject("Argument 'url' is required");
            return;
        }

        if (!audioPlayerServiceConnection.isConnected()) {
            call.reject("Audio service is not started");
            return;
        }

        audioPlayerServiceConnection.getService().open(trackId, url, trackTitle, trackArtist);
        call.resolve();
    }

    @PluginMethod
    public void play(PluginCall call) {
        audioPlayerServiceConnection.getService().play();
        call.resolve();
    }

    @PluginMethod
    public void togglePause(PluginCall call) {
        audioPlayerServiceConnection.getService().togglePause();
        call.resolve();
    }

    @PluginMethod
    public void seek(PluginCall call) {
        Float position = call.getFloat("position", 0.0f);
        if (position == null) { return; }
        audioPlayerServiceConnection.getService().seek(position.longValue() * 1000);
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        audioPlayerServiceConnection.getService().stop();
        call.resolve();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void onProgressChanged(PluginCall call) {
        call.setKeepAlive(true);
        getBridge().saveCall(call);
        audioPlayerServiceConnection.getService().setOnProgressChangeCall(call);
    }
}
