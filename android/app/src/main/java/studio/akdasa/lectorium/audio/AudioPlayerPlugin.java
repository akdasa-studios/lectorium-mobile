package studio.akdasa.lectorium.audio;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import studio.akdasa.lectorium.audio.AudioPlayerService.AudioPlayerServiceBinder;

@CapacitorPlugin(name = "AudioPlayer")
public class AudioPlayerPlugin extends Plugin {
    private static final String TAG = "AudioPlayerPlugin";
    private AudioPlayerService audioPlayerService;

    @Override
    public void load() {
        super.load();
        initializePlugin();
    }

    @PluginMethod
    public void create(PluginCall call) {
        try {
            String sourceId = audioId(call);

            if (audioPlayerService == null) {
                call.reject("Audio service is not created");
                return;
            }

            if (audioPlayerService.audioSourceExists(sourceId)) {
                call.reject(String.format("An audio source with the ID %s already exists.", audioId(call)));
                return;
            }

            AudioSource audioSource = new AudioSource(
                this,
                sourceId,
                call.getString("audioSource"),
                call.getString("friendlyTitle")
            );

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        audioPlayerService.createAudioSource(audioSource);
                        call.resolve();
                    } catch (Exception ex) {
                        call.reject("There was an issue creating the audio player (3).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue creating the audio player (4).", ex);
        }
    }

    @PluginMethod
    public void initialize(PluginCall call) {
        try {
            if (!audioSourceExists("initialize", call)) {
                return;
            }

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        audioPlayerService.initializeAudioSource(audioId(call));
                        call.resolve();
                    } catch (Exception ex) {
                        call.reject("There was an issue initializing the audio player (1).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue initializing the audio player (2).", ex);
        }
    }

    @PluginMethod
    public void getDuration(PluginCall call) {
        try {
            if (!audioSourceExists("getDuration", call)) {
                return;
            }

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        float duration = audioPlayerService.getDuration(audioId(call)) / 1000;

                        call.resolve(new JSObject().put("duration", duration));
                    } catch (Exception ex) {
                        call.reject("There was an issue getting the duration for the audio source (1).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue getting the duration for the audio source (2).", ex);
        }
    }

    @PluginMethod
    public void getCurrentTime(PluginCall call) {
        try {
            if (!audioSourceExists("getCurrentTime", call)) {
                return;
            }

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        float currentTime = audioPlayerService.getCurrentTime(audioId(call));

                        call.resolve(new JSObject().put("currentTime", currentTime));
                    } catch (Exception ex) {
                        call.reject("There was an issue getting the current time for the audio source (1).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue getting the current time for the audio source (2).", ex);
        }
    }

    @PluginMethod
    public void play(PluginCall call) {
        try {
            if (!audioSourceExists("play", call)) {
                return;
            }

            if (!audioPlayerService.isRunning()) {
                Log.i(TAG, String.format("Play for audio source ID %s is starting service", audioId(call)));
                getContextForAudioService().startService(AudioPlayerService.newIntent(getContextForAudioService()));
            }

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        audioPlayerService.play(audioId(call));
                        call.resolve();
                    } catch (Exception ex) {
                        call.reject("There was an issue playing the audio (1).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue playing the audio (2).", ex);
        }
    }

    @PluginMethod
    public void pause(PluginCall call) {
        try {
            if (!audioSourceExists("pause", call)) {
                return;
            }

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        audioPlayerService.pause(audioId(call));
                        call.resolve();
                    } catch (Exception ex) {
                        call.reject("There was an issue pausing the audio (1).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue pausing the audio (2).", ex);
        }
    }

    @PluginMethod
    public void seek(PluginCall call) {
        try {
            if (!audioSourceExists("seek", call)) {
                return;
            }

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        audioPlayerService.seek(audioId(call), Math.round(call.getFloat("position") * 1000));
                        call.resolve();
                    } catch (Exception ex) {
                        call.reject("There was an issue seeking the audio (2).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue seeking the audio (2).", ex);
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        try {
            if (!audioSourceExists("stop", call)) {
                return;
            }

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        audioPlayerService.stop(audioId(call));
                        call.resolve();
                    } catch (Exception ex) {
                        call.reject("There was an issue stopping the audio (1).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue stopping the audio (2).", ex);
        }
    }

    @PluginMethod
    public void setRate(PluginCall call) {
        try {
            if (!audioSourceExists("setRate", call)) {
                return;
            }

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        audioPlayerService.setRate(audioId(call), call.getFloat("rate"));
                        call.resolve();
                    } catch (Exception ex) {
                        call.reject("There was an issue setting the rate of the audio (1).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue setting the rate of the audio (2).", ex);
        }
    }

    @PluginMethod
    public void isPlaying(PluginCall call) {
        try {
            if (!audioSourceExists("isPlaying", call)) {
                return;
            }

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        boolean isPlaying = audioPlayerService.isPlaying(audioId(call));

                        call.resolve(new JSObject().put("isPlaying", isPlaying));
                    } catch (Exception ex) {
                        call.reject("There was an issue getting the playing status of the audio (1).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue getting the playing status of the audio (2).", ex);
        }
    }

    @PluginMethod
    public void destroy(PluginCall call) {
        try {
            String audioId = audioId(call);

            if (!audioSourceExists("destroy", call)) {
                return;
            }

            new Handler(Looper.getMainLooper()).post(
                () -> {
                    try {
                        audioPlayerService.destroyAudioSource(audioId);
                        call.resolve();
                    } catch (Exception ex) {
                        call.reject("There was an issue cleaning up the audio player (1).", ex);
                    }
                }
            );
        } catch (Exception ex) {
            call.reject("There was an issue cleaning up the audio player (2).", ex);
        }
    }

    @Override
    protected void handleOnStart() {
        Log.i(TAG, "Handling onStart");
        super.handleOnStart();
        initializePlugin();
    }

    @Override
    protected void handleOnStop() {
        Log.i(TAG, "Handling onStop");
        super.handleOnStop();
    }

    @Override
    protected void handleOnDestroy() {
        getContextForAudioService().stopService(AudioPlayerService.newIntent(getContextForAudioService()));
        unbindAudioService();

        super.handleOnDestroy();
    }

    private void initializePlugin() {
        bindAudioService();
    }

    private void bindAudioService() {
        if (audioPlayerService != null) {
            return;
        }

        Intent intent = AudioPlayerService.newIntent(getContextForAudioService());
        getContextForAudioService().bindService(intent, connection, Context.BIND_AUTO_CREATE);
    }

    private void unbindAudioService() {
        if (audioPlayerService == null) {
            return;
        }

        getContextForAudioService().unbindService(connection);
        audioPlayerService = null;
    }

    private ServiceConnection connection = new ServiceConnection() {
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

    private String audioId(PluginCall call) {
        return call.getString("audioId");
    }

    private boolean audioSourceExists(String methodName, PluginCall call) {
        return audioSourceExists(methodName, call, true);
    }

    private boolean audioSourceExists(String methodName, PluginCall call, boolean rejectIfError) {
        if (audioPlayerService == null) {
            Log.e(TAG, "audioPlayerService is null");
            call.reject(String.format("There was an issue trying to play the audio (%s [1])", methodName));
            return false;
        }

        boolean audioSourceExists = audioPlayerService.audioSourceExists(audioId(call));

        if (!audioSourceExists && rejectIfError) {
            Log.w(TAG, String.format("Audio source with ID %s was not found.", audioId(call)));
            call.reject(String.format("There was an issue trying to play the audio (%s [2])", methodName));
        }

        return audioSourceExists;
    }

    private Context getContextForAudioService() {
        return getBridge().getActivity().getApplicationContext();
    }
}
