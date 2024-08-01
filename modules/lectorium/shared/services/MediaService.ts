import { MediaItem } from '@core/models'
import { Database } from '@core/persistence'
import { cyrb53 } from '@core/utils'

type MediaDBSchema = {
  _id: string
  url: string
  path: string
  state: 'downloaded' | 'downloading' | 'pending'
}

/**
 * Service for interacting with media items in the database.
 */
export class MediaService {
  private database = new Database({ name: 'data' })
  private _onChangeHandlers: Array<() => void> = []

  // TODO: unsubscribe
  public onChange(handler: () => void) {
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
    const document = await this.database.db.get<MediaDBSchema>(id)
    return {
      id: document._id,
      url: document.url,
      path: document.path,
      state: document.state
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
    return (await this.database.db.allDocs<MediaDBSchema>({
      startkey: 'media::',
      endkey: 'media::\uffff',
      include_docs: true
    })).rows.map(row => ({
      id: row.doc!._id,
      url: row.doc!.url,
      path: row.doc!.path,
      state: row.doc!.state
    }))
  }

  /**
   * Queues a download for the specified URL.
   * @param url The URL of the media to download.
   * @param path The path where the downloaded media will be saved.
   * @returns A promise that resolves when the download is queued.
   */
  async queueDownload(
    url: string,
    path: string,
  ): Promise<void> {
    const urlHash = cyrb53(url)
    await this.database.db.put({
      _id: `media::${urlHash}`,
      url,
      path,
      state: 'pending'
    })

    this._onChangeHandlers.forEach(x => x())
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
    const document = await this.database.db.get<MediaDBSchema>(id)
    await this.database.db.put({ ...document, ...item })

    this._onChangeHandlers.forEach(x => x())
  }
}
