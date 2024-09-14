package studio.akdasa.lectorium.audio;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;


@CapacitorPlugin(name="AudioPlayer")
public class  AudioPlayerPlugin extends Plugin {

    private AudioPlayerService mediaPlaybackService;
    private boolean isBound = false;
    private final ServiceConnection connection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            AudioPlayerService.LocalBinder binder = (AudioPlayerService.LocalBinder) service;
            mediaPlaybackService = binder.getService();
            isBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            isBound = false;
        }
    };

    @Override
    public void load() {
        Intent intent = new Intent(getContext(), AudioPlayerService.class);

        getContext().bindService(intent, connection, Context.BIND_AUTO_CREATE);
        getContext().startForegroundService(intent);
    }

    @PluginMethod
    public void open(PluginCall call) {
        String url = call.getString("url");
        String trackId = call.getString("trackId");
        String trackTitle = call.getString("title");
        String trackArtist = call.getString("author");
        if (url == null) {
            call.reject("URL is required");
            return;
        }

        if (isBound) {
            mediaPlaybackService.open(trackId, url, trackTitle, trackArtist);
            call.resolve();
        } else {
            call.reject("Service not bound");
        }
    }

    @PluginMethod
    public void play(PluginCall call) {
        mediaPlaybackService.play();
        call.resolve();
    }

    @PluginMethod
    public void togglePause(PluginCall call) {
        mediaPlaybackService.togglePause();
        call.resolve();
    }

    @PluginMethod
    public void seek(PluginCall call) {
        Float position = call.getFloat("position", 0.0f);
        if (position == null) { return; }
        mediaPlaybackService.seek(position.longValue() * 1000);
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        mediaPlaybackService.stop();
        call.resolve();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void onProgressChanged(PluginCall call) {
        call.setKeepAlive(true);
        getBridge().saveCall(call);
        mediaPlaybackService.setOnProgressChangeCall(call);
    }

    @Override
    protected void handleOnDestroy() {
        if (isBound && !mediaPlaybackService.mediaPlayer.isPlaying()) {
            Intent intent = new Intent(getContext(), AudioPlayerService.class);
            getContext().unbindService(connection);
            getContext().stopService(intent);
            isBound = false;
        }
        super.handleOnDestroy();
    }
}
