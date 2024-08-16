import { PlaylistItem } from '@core/models'
import { Database } from '@core/persistence'

type Aviability = "available" | "unavailable" | "downloaded" | "unknown"

/**
 * Represents the schema for a playlist item in the database.
 */
type PlaylistItemDBSchema = {
  _id: string
  trackId: string
  collectionId?: string
  order: number
  played: number

  mediaStatus: Aviability
  transcriptStatus: Aviability
}

export type PlaylistChangedEvent = {
  item: PlaylistItem,
  event: "added" | "removed" | "updated"
}

/**
 * Service for managing playlist items.
 */
export class PlaylistService {
  private _database = new Database({ name: 'data' })
  private _onChangeHandlers: Array<(event: PlaylistChangedEvent) => void> = []

  // TODO: unsubscribe
  public onChange(handler: (event: PlaylistChangedEvent) => void) {
    this._onChangeHandlers.push(handler)
  }

  /**
   * Retrieves a playlist item by its ID.
   * @param id - The ID of the playlist item.
   * @returns A promise that resolves to the playlist item.
   */
  async get(id: string): Promise<PlaylistItem> {
    const document = await this._database.db.get<PlaylistItemDBSchema>(`playlistItem::${id}`)
    return {
      trackId: document.trackId,
      collectionId: document.collectionId,
      order: document.order,
      played: document.played,
      mediaStatus: document.mediaStatus,
      transcriptStatus: document.transcriptStatus
    }
  }

  /**
   * Retrieves all playlist items.
   * @returns A promise that resolves to an array of playlist items.
   */
  async getAll(): Promise<PlaylistItem[]> {
    return (await this._database.db.allDocs<PlaylistItemDBSchema>({
      startkey: 'playlistItem::',
      endkey: 'playlistItem::\uffff',
      include_docs: true
    })).rows.map(row => ({
      trackId: row.doc!.trackId,
      collectionId: row.doc!.collectionId,
      order: row.doc!.order,
      played: row.doc!.played,
      mediaStatus: row.doc!.mediaStatus,
      transcriptStatus: row.doc!.transcriptStatus
    }))
  }

  /**
   * Retrieves the IDs of all tracks in the playlist.
   * @returns A promise that resolves to an array of track IDs.
   */
  async getTrackIds(): Promise<string[]> {
    return (await this.getAll()).map(item => item.trackId)
  }

  /**
   * Adds a track to the playlist.
   * @param trackId - The ID of the track to add.
   * @returns A promise that resolves when the track is added.
   */
  public async addTrack(
    trackId: string
  ): Promise<void> {
    // Get the maximum order value from the existing tracks
    // TODO: maybe it might be done in a more efficient way
    const existingTracksOrder = (await this.getAll()).map(item => item.order)
    const maxOrder = Math.max(...existingTracksOrder, 0)

    await this._database.db.put<PlaylistItemDBSchema>({
      _id: `playlistItem::${trackId}`,
      trackId: trackId,
      order: maxOrder + 1,
      played: 0,
      mediaStatus: "available",
      transcriptStatus: "unknown"
    })

    this._onChangeHandlers.forEach(x => x({
      item: {
        trackId: trackId,
        order: maxOrder + 1,
        played: 0,
        mediaStatus: "available",
        transcriptStatus: "unknown"
      },
      event: "added"
    }))
  }

  /**
   * Sets the played time for a track in the playlist.
   * @param trackId - The ID of the track.
   * @param played - The played time in seconds.
   * @returns A promise that resolves when the played time is set.
   */
  public async setPlayedTime(
    trackId: string,
    played: number
  ): Promise<void> {
    console.log('setPlayedTime', trackId, played)
    const document = await this._database.db.get<PlaylistItemDBSchema>(`playlistItem::${trackId}`)
    await this._database.db.put({
      ...document,
      played: played
    })
  }

  public async setMediaStatus(
    trackId: string,
    aviability: Aviability
  ): Promise<void> {
    const document = await this._database.db.get<PlaylistItemDBSchema>(`playlistItem::${trackId}`)
    await this._database.db.put({
      ...document,
      mediaStatus: aviability
    })

    this._onChangeHandlers.forEach(x => x({
      event: "updated",
      item: {
        ...document,
        mediaStatus: aviability
      }
    }))
  }

  public async setTranscriptStatus(
    trackId: string,
    aviability: Aviability
  ): Promise<void> {
    const document = await this._database.db.get<PlaylistItemDBSchema>(`playlistItem::${trackId}`)
    await this._database.db.put({
      ...document,
      transcriptStatus: aviability
    })

    this._onChangeHandlers.forEach(x => x({
      event: "updated",
      item: {
        ...document,
        transcriptStatus: aviability
      }
    }))
  }

  public async removeTrack(
    trackId: string
  ): Promise<void> {
    // TODO: remove associated media and transcript
    const document = await this._database.db.get<PlaylistItemDBSchema>(`playlistItem::${trackId}`)
    await this._database.db.remove(document)

    this._onChangeHandlers.forEach(x => x({
      event: "removed",
      item: document
    }))
  }
}
