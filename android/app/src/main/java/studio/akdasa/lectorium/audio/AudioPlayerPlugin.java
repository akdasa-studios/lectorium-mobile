package studio.akdasa.lectorium.audio;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import androidx.core.content.ContextCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name="AudioPlayer")
public class AudioPlayerPlugin extends Plugin {
    private AudioPlayerService audioPlayerService;

    private final ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            AudioPlayerService.LocalBinder binder = (AudioPlayerService.LocalBinder) service;
            audioPlayerService = binder.getService();
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            audioPlayerService = null;
        }
    };

    @Override
    public void load() {
        super.load();
        Intent intent = new Intent(getContext(), AudioPlayerService.class);
        ContextCompat.startForegroundService(getContext(), intent);
        getContext().bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
    }

    @PluginMethod
    public void open(PluginCall call) {
        String trackId = call.getString("trackId");
        String url = call.getString("url");
        String title = call.getString("title");
        String author = call.getString("author");

        if (url == null || url.isEmpty()) {
            call.reject("URL is required");
            return;
        }

        Intent serviceIntent = new Intent(getContext(), AudioPlayerService.class);
        serviceIntent.setAction(AudioPlayerService.ACTION_OPEN);
        serviceIntent.putExtra("url", url);
        serviceIntent.putExtra("title", title);
        serviceIntent.putExtra("author", author);
        serviceIntent.putExtra("trackId", trackId);

        getContext().startForegroundService(serviceIntent);
        call.resolve();

        // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        //     getContext().startForegroundService(serviceIntent);
        // } else {
        //     getContext().startService(serviceIntent);
        // }
    }

    @PluginMethod
    public void play(PluginCall call) {
        Intent serviceIntent = new Intent(getContext(), AudioPlayerService.class);
        serviceIntent.setAction(AudioPlayerService.ACTION_PLAY);
        getContext().startService(serviceIntent);
        call.resolve();
    }

    @PluginMethod
    public void togglePause(PluginCall call) {
        Intent serviceIntent = new Intent(getContext(), AudioPlayerService.class);
        serviceIntent.setAction(AudioPlayerService.ACTION_TOGGLE_PAUSE);
        getContext().startService(serviceIntent);
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Intent serviceIntent = new Intent(getContext(), AudioPlayerService.class);
        serviceIntent.setAction(AudioPlayerService.ACTION_STOP);
        getContext().startService(serviceIntent);
        call.resolve();
    }

    @PluginMethod
    public void seek(PluginCall call) {
        Float position = call.getFloat("position", 0.0f);
        if (position == null) { return; }

        Intent serviceIntent = new Intent(getContext(), AudioPlayerService.class);
        serviceIntent.setAction(AudioPlayerService.ACTION_SEEK);
        serviceIntent.putExtra("position", position.longValue() * 1000);
        getContext().startService(serviceIntent);
        call.resolve();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void onProgressChanged(PluginCall call) {
        call.setKeepAlive(true);
        getBridge().saveCall(call);
        audioPlayerService.setCall(call);
//        progressTracker = new AudioPlayerProgressTracker();
//        progressTracker.setPlayer(audioPlayerService.getMediaPlayer());
//        progressTracker.setCall(call);
    }

    @Override
    protected void handleOnDestroy() {
        if (audioPlayerService != null) {
            getContext().unbindService(serviceConnection);
            audioPlayerService = null;
        }
        super.handleOnDestroy();
    }
}