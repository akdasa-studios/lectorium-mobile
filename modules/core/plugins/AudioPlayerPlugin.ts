import { Plugin, registerPlugin } from '@capacitor/core'

interface AudioPlayerDefaultParams {
    audioId: string
}

interface AudioPlayerPrepareParams extends AudioPlayerDefaultParams {
    audioSource: string
    friendlyTitle: string
    useForNotification: boolean
    isBackgroundMusic?: boolean
    loop?: boolean
}

interface AudioPlayerListenerParams {
    audioId: string
}

interface AudioPlayerListenerResult {
    callbackId: string
}

export interface AudioPlayerPlugin extends Plugin {
    create(params: AudioPlayerPrepareParams): Promise<{ success: boolean }>
    initialize(params: AudioPlayerDefaultParams): Promise<{ success: boolean }>

    changeAudioSource(params: AudioPlayerDefaultParams & { source: string }): Promise<void>

    getDuration(params: AudioPlayerDefaultParams): Promise<{ duration: number }>
    getCurrentTime(params: AudioPlayerDefaultParams): Promise<{ currentTime: number }>

    play(params: AudioPlayerDefaultParams): Promise<void>
    pause(params: AudioPlayerDefaultParams): Promise<void>
    seek(params: AudioPlayerDefaultParams & { timeInSeconds: number }): Promise<void>
    stop(params: AudioPlayerDefaultParams): Promise<void>

    setVolume(params: AudioPlayerDefaultParams & { volume: number }): Promise<void>
    setRate(params: AudioPlayerDefaultParams & { rate: number }): Promise<void>

    isPlaying(params: AudioPlayerDefaultParams): Promise<{ isPlaying: boolean }>

    destroy(params: AudioPlayerDefaultParams): Promise<void>

    onAppGainsFocus(
        params: AudioPlayerListenerParams,
        callback: () => void
    ): Promise<AudioPlayerListenerResult>

    onAppLosesFocus(
        params: AudioPlayerListenerParams,
        callback: () => void
    ): Promise<AudioPlayerListenerResult>

    onAudioReady(
        params: AudioPlayerListenerParams,
        callback: () => void
    ): Promise<AudioPlayerListenerResult>

    onAudioEnd(
        params: AudioPlayerListenerParams,
        callback: () => void
    ): Promise<AudioPlayerListenerResult>

    onPlaybackStatusChange(
        params: AudioPlayerListenerParams,
        callback: (result: { status: 'playing' | 'paused' | 'stopped' }) => void
    ): Promise<AudioPlayerListenerResult>
}

export const AudioPlayer = registerPlugin<AudioPlayerPlugin>('AudioPlayer')
