export enum PlayingStatus {
  None,

  /** Track is in playlist */
  InQueue,
  Loading,
  Playing,
  Paused,
  Stoped,
  Played,
}

export interface TrackViewModel {
  /** Track unique identifier */
  trackId: string

  playlistItemId?: string

  /** Track title */
  title: string

  /** Track location */
  location: string

  /** Track references */
  references: string[]

  /** Is track playing? */
  playingStatus: PlayingStatus
}

