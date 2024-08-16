export type MediaItem = {
  _id: string

  // Remote url to download file
  remoteUrl: string

  // Local url to access file
  localUrl?: string

  // Path to file on device
  localPath: string

  // Downloading state
  state: 'downloaded' | 'downloading' | 'pending' | 'failed'

  // Size in bytes
  size?: number

  // Any meta information
  meta?: any
}
