package studio.akdasa.lectorium.audio.mediaStateNotifications;

public record MediaState(
        String trackId,
        long position,
        long duration,
        boolean isPlaying
) { }
