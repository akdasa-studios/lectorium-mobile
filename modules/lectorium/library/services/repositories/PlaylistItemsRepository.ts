import { PlaylistItem } from '@core/models'
import { Database, Repository } from '@core/persistence/Database'

export class PlaylistItemsRepository {
  private _db: Repository<PlaylistItem>

  constructor() {
    this._db = new Repository<PlaylistItem>(
      "playlistItem",
      new Database({ name: 'data' })
    )
  }

  public async get(
    trackId: string
  ): Promise<PlaylistItem> {
    return await this._db.get(`playlistItem/${trackId}`)
  }

  public async addTrack(
    trackId: string
  ): Promise<void> {
    // Get the maximum order value from the existing tracks
    const existingTracksOrder = (await this.getAll()).map(item => item.order)
    const maxOrder = Math.max(...existingTracksOrder, 0)

    // Add the new track to the playlist
    await this._db.put({
      //@ts-ignore
      _id: `playlistItem/${trackId}`,
      trackId: trackId,
      order: maxOrder + 1
    })
  }

  public async setPlayedTime(
    trackId: string,
    played: number
  ): Promise<void> {
    const entity = await this.get(trackId)
    await this._db.put({
      ...entity,
      played: played
    })
  }

  public async getAll(): Promise<PlaylistItem[]> {
    return this._db.getAll()
  }
}
