import { Plugin } from '@capacitor/core'

export interface AudioPlayerDefaultParams {
  audioId: string
}

export interface AudioPlayerPrepareParams extends AudioPlayerDefaultParams {
  audioSource: string
  // friendlyTitle: string
  // useForNotification: boolean
}

export interface AudioPlayerListenerResult {
  callbackId: string
}

export interface AudioPlayerPlugin extends Plugin {
  create(params: AudioPlayerPrepareParams): Promise<{ success: boolean }>

  play(params: AudioPlayerDefaultParams): Promise<void>
  pause(params: AudioPlayerDefaultParams): Promise<void>
  seek(params: AudioPlayerDefaultParams & { position: number }): Promise<void>
  stop(params: AudioPlayerDefaultParams): Promise<void>

  // destroy(params: AudioPlayerDefaultParams): Promise<void>

  onProgressChanged(
    params: AudioPlayerDefaultParams,
    callback: (result: { position: number, playing: boolean, duration: number }) => void
  ): Promise<AudioPlayerListenerResult>

}
