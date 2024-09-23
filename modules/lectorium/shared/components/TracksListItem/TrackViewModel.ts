export enum PlayingStatus {
  None,
  InQueue,
  Loading,
  Playing,
  Paused,
  Stopped,
  Played,
}

export interface TrackViewModel {
  /** Track unique identifier */
  trackId: string

  playlistItemId?: string

  /** Track title */
  title: string

  /** Author */
  author: string

  /** Track location */
  location: string

  /** Track references */
  references: string[]

  /** Is track playing? */
  playingStatus: PlayingStatus,

  /** Date */
  date: string
}

