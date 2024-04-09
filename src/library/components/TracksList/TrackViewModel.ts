export enum PlayingStatus {
  None,
  Playing,
  Paused,
}

export interface TrackViewModel {
  /** Track unique identifier */
  id: string

  /** Track title */
  title: string

  /** Track location */
  location: string

  /** Track references */
  references: string[]

  /** Is track playing? */
  playingStatus: PlayingStatus
}

