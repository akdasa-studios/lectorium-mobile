import { Plugin } from '@capacitor/core'

export interface AudioPlayerDefaultParams {
  audioId: string
}

export interface AudioPlayerPrepareParams extends AudioPlayerDefaultParams {
  audioSource: string
  friendlyTitle: string
  useForNotification: boolean
  isBackgroundMusic?: boolean
  loop?: boolean
}

export interface AudioPlayerPlugin extends Plugin {
  create(params: AudioPlayerPrepareParams): Promise<{ success: boolean }>
  initialize(params: AudioPlayerDefaultParams): Promise<{ success: boolean }>

  getDuration(params: AudioPlayerDefaultParams): Promise<{ duration: number }>
  getCurrentTime(params: AudioPlayerDefaultParams): Promise<{ currentTime: number }>

  play(params: AudioPlayerDefaultParams): Promise<void>
  pause(params: AudioPlayerDefaultParams): Promise<void>
  seek(params: AudioPlayerDefaultParams & { position: number }): Promise<void>
  stop(params: AudioPlayerDefaultParams): Promise<void>

  setRate(params: AudioPlayerDefaultParams & { rate: number }): Promise<void>
  isPlaying(params: AudioPlayerDefaultParams): Promise<{ isPlaying: boolean }>

  destroy(params: AudioPlayerDefaultParams): Promise<void>
}
