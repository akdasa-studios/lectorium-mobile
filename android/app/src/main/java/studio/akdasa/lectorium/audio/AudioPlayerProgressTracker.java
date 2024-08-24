//package studio.akdasa.lectorium.audio;
//
//import android.media.MediaPlayer;
//import android.os.Handler;
//
//import com.getcapacitor.JSObject;
//import com.getcapacitor.PluginCall;
//
//public class AudioPlayerProgressTracker implements Runnable {
////    private MediaPlayer player;
//    private PluginCall call;
//    private AudioPlayerService service;
//    private final Handler handler = new Handler();
//
//    public AudioPlayerProgressTracker() {
//        handler.post(this);
//    }
//
//    public void run() {
//        MediaPlayer player = this.service.getMediaPlayer();
//
//        if (player == null) { return; }
//        if (call == null) { return; }
//
//        JSObject callPayload = new JSObject();
//        callPayload.put("position", player.getCurrentPosition() / 1000);
//        callPayload.put("playing", player.isPlaying());
//        callPayload.put("duration", player.getDuration() / 1000);
//        this.call.resolve(callPayload);
//
//        handler.postDelayed(this, 1000);
//        handler.postDelayed(new Runnable() {
//            @Override
//            public void run() {
//
//            }
//        })
//    }
//
//    public void setCall(PluginCall call) {
//        this.call = call;
//    }
//
//    public void setService(AudioPlayerService service) {
//        this.service = service;
//    }
//}
