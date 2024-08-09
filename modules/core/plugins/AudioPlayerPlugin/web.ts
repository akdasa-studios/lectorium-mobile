import { PluginListenerHandle } from "@capacitor/core";
import { AudioPlayerPlugin, AudioPlayerPrepareParams, AudioPlayerListenerResult } from "./interface";


export class WebAudioPlayerPlugin implements AudioPlayerPlugin {
  onProgressChanged(
      callback: (result: { position: number; playing: boolean; duration: number; }) => void
  ): Promise<AudioPlayerListenerResult> {
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

  async play(): Promise<void> {
    if (this.audio) {
      await this.audio.play();
    }
  }

  async pause(): Promise<void> {
    if (this.audio) {
      this.audio.pause();
    }
  }

  async seek(options: { position: number }): Promise<void> {
    if (this.audio) {
      this.audio.currentTime = options.position;
    }
  }

  async stop(): Promise<void> {
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