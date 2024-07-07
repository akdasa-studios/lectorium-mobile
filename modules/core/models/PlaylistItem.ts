export enum PlaylistItemStatus {
  New,
  Playing,
  Played,
}

export type PlaylistItem = {
  id: string
  trackId: string
  collectionId?: string
  order: number
}
