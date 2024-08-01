export type MediaItem = {
  id: string;
  url: string;
  path: string;
  state: 'downloaded' | 'downloading' | 'pending' | 'failed';
  error?: string;
}
