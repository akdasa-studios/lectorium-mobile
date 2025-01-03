import { MediaItem } from '@core/models'
import { Database } from '@core/persistence'
import { cyrb53 } from '@core/utils'
import { DatabaseService, ItemChangedEventHandler } from '@lectorium/shared'


type MediaDbScheme = {
  _id: string
  title: string
  remoteUrl: string
  localUrl?: string
  state: 'downloaded' | 'downloading' | 'pending' | 'failed'
  size?: number
  meta?: any
}

const mediaItemSerializer = (item: MediaItem): MediaDbScheme => ({
  _id: item._id,
  title: item.title,
  remoteUrl: item.remoteUrl,
  localUrl: item.localUrl,
  state: item.state,
  size: item.size,
  meta: item.meta,
})

const mediaItemDeserializer = (document: MediaDbScheme): MediaItem => ({
  _id: document._id,
  title: document.title,
  remoteUrl: document.remoteUrl,
  localUrl: document.localUrl,
  state: document.state,
  size: document.size,
  meta: document.meta,
})

/**
 * Service for interacting with media items in the database.
 */
export class MediaService {
  private _databaseService: DatabaseService<MediaItem, MediaDbScheme>

  constructor(database: Database) {
    this._databaseService = new DatabaseService(
      database, mediaItemSerializer, mediaItemDeserializer)
  }

  public subscribe(
    handler: ItemChangedEventHandler<MediaItem>
  ) {
    this._databaseService.subscribe(handler)
  }

  async getById(
    id: string
  ): Promise<MediaItem | undefined> {
    return await this._databaseService.getOne(`media::${id}`)
  }

  async getAll(): Promise<MediaItem[]> {
    return this._databaseService.getAll({
      startKey: 'media::',
      endKey: 'media::\uffff',
    })
  }

  async getPending(): Promise<MediaItem[]> {
    // TODO: filer on DB level
    return (await this.getAll()).filter(item => item.state === 'pending')
  }

  async removeOne(
    id: string
  ): Promise<void> {
    await this._databaseService.removeOne(id)
  }

  async updateState(
    id: string,
    state: Partial<Pick<MediaItem, 'state' | 'size' | 'localUrl' | 'meta' >>
  ): Promise<void> {
    const mediaItem = await this._databaseService.getOne(id)
    const updatedMediaItem = { ...mediaItem, ...state }
    await this._databaseService.updateOne(id, updatedMediaItem)
  }

  async queueDownload(
    id: string,
    title: string,
    remoteUrl: string,
    meta?: any
  ): Promise<void> {
    await this._databaseService.addOne({
      _id: `media::${id}`,
      title,
      state: 'pending',
      remoteUrl, meta
    })
  }
}
