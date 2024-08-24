import { Plugin } from '@capacitor/core'

export type OpenParams = {
  url: string,
  title: string,
  author: string,
  trackId: string,
}

export interface AudioPlayerListenerResult {
  callbackId: string
}

export interface AudioPlayerPlugin extends Plugin {
  open(params: OpenParams): Promise<void>
  play(): Promise<void>
  togglePause(): Promise<void>
  seek(options: { position: number }): Promise<void>
  stop(): Promise<void>

  // destroy(params: AudioPlayerDefaultParams): Promise<void>
  onProgressChanged(
    callback: (result: { position: number, playing: boolean, duration: number, trackId: string }) => void
  ): Promise<AudioPlayerListenerResult>
}
