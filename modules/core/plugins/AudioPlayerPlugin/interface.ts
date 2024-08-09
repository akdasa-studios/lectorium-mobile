import { Plugin } from '@capacitor/core'

export interface AudioPlayerPrepareParams {
  audioSource: string
}

export interface AudioPlayerListenerResult {
  callbackId: string
}

export interface AudioPlayerPlugin extends Plugin {
  create(params: AudioPlayerPrepareParams): Promise<{ success: boolean }>

  play(): Promise<void>
  pause(): Promise<void>
  seek(options: { position: number }): Promise<void>
  stop(): Promise<void>

  // destroy(params: AudioPlayerDefaultParams): Promise<void>

  onProgressChanged(
    callback: (result: { position: number, playing: boolean, duration: number }) => void
  ): Promise<AudioPlayerListenerResult>
}
