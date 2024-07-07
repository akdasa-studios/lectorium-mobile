export enum PlaylistItemStatus {
  New,
  Playing,
  Played,
}

export type PlaylistItem = {
  trackId: string
  collectionId?: string
  order: number
  played: number
}
