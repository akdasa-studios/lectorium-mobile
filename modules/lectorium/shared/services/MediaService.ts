import { MediaItem } from '@core/models'
import { Database } from '@core/persistence'
import { cyrb53 } from '@core/utils'

type MediaDBSchema = {
  _id: string
  remoteUrl: string
  localUrl: string
  localPath: string
  state: 'downloaded' | 'downloading' | 'pending' | 'failed'
  size?: number
  meta?: any
}

export type MediaChangedEvent = {
  item: MediaItem,
  event: "added" | "removed" | "updated"
}

/**
 * Service for interacting with media items in the database.
 */
export class MediaService {
  private _database = new Database({ name: 'data' })
  private _onChangeHandlers: Array<(event: MediaChangedEvent) => void> = []

  // TODO: unsubscribe
  public onChange(handler: (event: MediaChangedEvent) => void) {
    this._onChangeHandlers.push(handler)
  }

  /**
   * Retrieves a media item by its ID.
   * @param id - The ID of the media item to retrieve.
   * @returns A Promise that resolves to the retrieved media item.
   */
  async get(
    id: string
  ): Promise<MediaItem> {
    const document = await this._database.db.get<MediaDBSchema>(id)
    return {
      id: document._id,
      remoteUrl: document.remoteUrl,
      localUrl: document.localUrl,
      localPath: document.localPath,
      state: document.state,
      size: document.size,
      meta: document.meta,
    }
  }

  async getByUrl(
    url: string
  ): Promise<MediaItem | undefined> {
    const urlHash = cyrb53(url)
    return await this.get(`media::${urlHash}`)
  }

  /**
   * Retrieves all media items from the database.
   * @returns A promise that resolves to an array of MediaItem objects.
   */
  async getAll(): Promise<MediaItem[]> {
    return (await this._database.db.allDocs<MediaDBSchema>({
      startkey: 'media::',
      endkey: 'media::\uffff',
      include_docs: true
    })).rows.map(row => ({
      id: row.doc!._id,
      remoteUrl: row.doc!.remoteUrl,
      localUrl: row.doc!.localUrl,
      localPath: row.doc!.localPath,
      state: row.doc!.state,
      size: row.doc!.size,
      meta: row.doc!.meta,
    }))
  }

  /**
   * Queues a download for the specified URL.
   * @param url The URL of the media to download.
   * @param path The path where the downloaded media will be saved.
   * @returns A promise that resolves when the download is queued.
   */
  async queueDownload(
    remoteUrl: string,
    localPath: string,
    meta?: any
  ): Promise<void> {
    const urlHash = cyrb53(remoteUrl)
    await this._database.db.put({
      _id: `media::${urlHash}`,
      remoteUrl,
      localPath,
      state: 'pending',
      meta: meta,
    })

    this._onChangeHandlers.forEach(x => x({
      event: "added",
      item: {
        id: `${urlHash}`,
        remoteUrl,
        localUrl: '',
        localPath,
        state: 'pending',
        meta: meta
      }
    }))
  }

  /**
   * Marks a media item as downloaded.
   * @param id - The ID of the media item to mark as downloaded.
   * @returns A Promise that resolves when the media item is successfully marked as downloaded.
   */
  async update(
    id: string,
    item: Partial<Omit<MediaItem, "id">>
  ): Promise<void> {
    const document = await this._database.db.get<MediaDBSchema>(id)
    await this._database.db.put({ ...document, ...item })

    this._onChangeHandlers.forEach(x => x({
      event: "updated",
      item: {
        id,
        remoteUrl: item.remoteUrl || document.remoteUrl,
        localUrl:  item.localUrl || document.localUrl,
        localPath: item.localPath || document.localPath,
        state:     item.state || document.state,
        meta:      item.meta || document.meta,
      }
    }))
  }
}
