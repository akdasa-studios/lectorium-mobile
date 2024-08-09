package studio.akdasa.lectorium.audio;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import studio.akdasa.lectorium.audio.AudioPlayerService.AudioPlayerServiceBinder;

@CapacitorPlugin(name = "AudioPlayer")
public class AudioPlayerPlugin extends Plugin {
    private static final String TAG = "AudioPlayerPlugin";
    private AudioPlayerService audioPlayerService;

    private final ServiceConnection connection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            Log.i(TAG, "Service connected");
            AudioPlayerServiceBinder binder = (AudioPlayerServiceBinder) service;
            audioPlayerService = binder.getService();
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            Log.i(TAG, "Service disconnected");
            audioPlayerService = null;
        }
    };

    @Override
    public void load() {
        super.load();
        createNotificationChannel();
        bindAudioService();
        startAudioService();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel playbackChannel = new NotificationChannel(
                    AudioPlayerService.PLAYBACK_CHANNEL_ID,
                    "Audio playback",
                    NotificationManager.IMPORTANCE_LOW
            );

            NotificationManager manager = getContext().getSystemService(NotificationManager.class);
            manager.createNotificationChannel(playbackChannel);
        }
    }

    private void bindAudioService() {
        if (audioPlayerService != null) {
            return;
        }

        Context appContext = getBridge().getActivity().getApplicationContext();
        Intent intent = AudioPlayerService.newIntent(appContext);
        appContext.bindService(intent, connection, Context.BIND_AUTO_CREATE);
    }

    private void startAudioService() {
        Context appContext = getBridge().getActivity().getApplicationContext();
        appContext.startService(AudioPlayerService.newIntent(appContext));
    }

    @PluginMethod
    public void create(@NonNull PluginCall call) {
        String audioSource = call.getString("audioSource");

        if (audioPlayerService == null) {
            call.reject("Audio service is not initialized.");
            return;
        }

        runInMainThread(() -> {
            audioPlayerService.createAudioSource(audioSource);
            call.resolve();
        });
    }

    @PluginMethod
    public void play(PluginCall call) {
        runInMainThread(() -> {
            audioPlayerService.play();
            call.resolve();
        });
    }

    @PluginMethod
    public void pause(PluginCall call) {
        runInMainThread(() -> {
            audioPlayerService.pause();
            call.resolve();
        });
    }

    @PluginMethod
    public void seek(@NonNull PluginCall call) {
        long position = call.getInt("position");
        runInMainThread(() -> {
            audioPlayerService.seek(position * 1000);
            call.resolve();
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        runInMainThread(() -> {
            audioPlayerService.stop();
            call.resolve();
        });
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void onProgressChanged(@NonNull PluginCall call) {
        call.setKeepAlive(true);
        getBridge().saveCall(call);
        audioPlayerService.addOnStatusChangeListener(call);
    }

    private void runInMainThread(Runnable r) {
        new Handler(Looper.getMainLooper()).post(r);
    }
//    @PluginMethod
//    public void destroy(PluginCall call) {
//        try {
//            String audioId = audioId(call);
//
//            if (!audioSourceExists("destroy", call)) {
//                return;
//            }
//
//            new Handler(Looper.getMainLooper()).post(
//                    () -> {
//                        try {
//                            audioPlayerService.destroyAudioSource(audioId);
//                            call.resolve();
//                        } catch (Exception ex) {
//                            call.reject("There was an issue cleaning up the audio player (1).", ex);
//                        }
//                    }
//            );
//        } catch (Exception ex) {
//            call.reject("There was an issue cleaning up the audio player (2).", ex);
//        }
//    }
//
//    @Override
//    protected void handleOnDestroy() {
//        getContextForAudioService().stopService(AudioPlayerService.newIntent(getContextForAudioService()));
//        unbindAudioService();
//
//        super.handleOnDestroy();
//    }
//
//    private void unbindAudioService() {
//        if (audioPlayerService == null) {
//            return;
//        }
//
//        getContextForAudioService().unbindService(connection);
//        audioPlayerService = null;
//    }
}
