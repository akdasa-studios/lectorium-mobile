import { Collection } from '@core/models'
import { Database, Repository } from '@core/persistence/Database'

export class CollectionsRepository {
  private _db: Repository<Collection>

  constructor() {
    this._db = new Repository<Collection>(
      "collection",
      new Database({ name: 'data' })
    )
  }

  public async add(
    collection: Collection
  ): Promise<void> {
    await this._db.put({
      ...collection,
      //@ts-ignore
      _id: `collection/${collection.title}`,
    })
  }

  public async get(
    trackId: string
  ): Promise<Collection> {
    return await this._db.get(`collection/${trackId}`)
  }

  public async getAll(): Promise<Collection[]> {
    return this._db.getAll()
  }
}

export const EmptyCollection = () => Object.assign({}, {
  id: '',
  title: '',
  authors: [],
  sources: [],
  languages: [],
  cover: '',
})