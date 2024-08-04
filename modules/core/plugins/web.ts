import { PluginListenerHandle } from "@capacitor/core";
import { AudioPlayerPlugin, AudioPlayerDefaultParams, AudioPlayerPrepareParams } from "./interface";


export class WebAudioPlayerPlugin implements AudioPlayerPlugin {
  private audio: HTMLAudioElement | null = null;


  async create(params: AudioPlayerPrepareParams): Promise<{ success: boolean }> {
    // Create a new audio element
    console.log('create', params);
    this.audio = new Audio(params.audioSource);
    return { success: true };
  }

  async initialize(params: AudioPlayerDefaultParams): Promise<{ success: boolean }> {
    // Initialize the audio player
    if (this.audio) {
      return { success: true };
    }
    return { success: false };
  }

  async getDuration(params: AudioPlayerDefaultParams): Promise<{ duration: number }> {
    if (this.audio) {
      return { duration: this.audio.duration};
    }
    return { duration: 0 };
  }

  async getCurrentTime(params: AudioPlayerDefaultParams): Promise<{ currentTime: number }> {
    if (this.audio) {
      return { currentTime: this.audio.currentTime };
    }
    return { currentTime: 0 };
  }

  async play(params: AudioPlayerDefaultParams): Promise<void> {
    if (this.audio) {
      await this.audio.play();
    }
  }

  async pause(params: AudioPlayerDefaultParams): Promise<void> {
    if (this.audio) {
      this.audio.pause();
    }
  }

  async seek(params: AudioPlayerDefaultParams & { position: number }): Promise<void> {
    if (this.audio) {
      console.log('seek!!!', params.position);
      this.audio.currentTime = params.position;
    }
  }

  async stop(params: AudioPlayerDefaultParams): Promise<void> {
    if (this.audio) {
      console.log('stop!!!');
      this.audio.pause();
      this.audio.remove();

      // this.audio.currentTime = 0;
    }
  }

  async setRate(params: AudioPlayerDefaultParams & { rate: number }): Promise<void> {
    if (this.audio) {
      this.audio.playbackRate = params.rate;
    }
  }

  async isPlaying(params: AudioPlayerDefaultParams): Promise<{ isPlaying: boolean }> {
    if (this.audio) {
      return { isPlaying: !this.audio.paused };
    }
    return { isPlaying: false };
  }

  async destroy(params: AudioPlayerDefaultParams): Promise<void> {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  addListener(eventName: string, listenerFunc: (...args: any[]) => any): Promise<PluginListenerHandle> {
    throw new Error("Method not implemented.");
  }
  removeAllListeners(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}