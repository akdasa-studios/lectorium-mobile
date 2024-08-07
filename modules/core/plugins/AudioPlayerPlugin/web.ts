import { PluginListenerHandle } from "@capacitor/core";
import { AudioPlayerPlugin, AudioPlayerDefaultParams, AudioPlayerPrepareParams, AudioPlayerListenerResult } from "./interface";


export class WebAudioPlayerPlugin implements AudioPlayerPlugin {
  onProgressChanged(params: AudioPlayerDefaultParams, callback: (result: { position: number; playing: boolean; duration: number; }) => void): Promise<AudioPlayerListenerResult> {
    return new Promise((resolve, reject) => {
      resolve({ callbackId: "123" });
    });
    // throw new Error("Method not implemented.");
  }
  private audio: HTMLAudioElement | null = null;


  async create(params: AudioPlayerPrepareParams): Promise<{ success: boolean }> {
    this.audio = new Audio(params.audioSource);
    return { success: true };
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
      this.audio.currentTime = params.position;
    }
  }

  async stop(params: AudioPlayerDefaultParams): Promise<void> {
    if (this.audio) {
      this.audio.pause();
      this.audio.remove();

      // this.audio.currentTime = 0;
    }
  }

  addListener(eventName: string, listenerFunc: (...args: any[]) => any): Promise<PluginListenerHandle> {
    throw new Error("Method not implemented.");
  }
  removeAllListeners(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}