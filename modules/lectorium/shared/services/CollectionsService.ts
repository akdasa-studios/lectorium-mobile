import { Collection } from '@core/models'
import { Database } from '@core/persistence/Database'

type CollectionsDBSchema = {
  _id: string,
  title: string,
  authors: string[],
  sources: string[],
  languages: string[],
  cover: string,
}

export class CollectionsService {
  private database = new Database({ name: 'library' })
  private _onChangeHandlers: Array<() => void> = []

  public onChange(handler: () => void) {
    this._onChangeHandlers.push(handler)
  }

  public async add(
    collection: Collection
  ): Promise<void> {
    await this.database.db.put<CollectionsDBSchema>({
      _id: `collection::${collection.title}`,
      title: collection.title,
      authors: collection.authors,
      sources: collection.sources,
      languages: collection.languages,
      cover: collection.cover,
    })

    this._onChangeHandlers.forEach(x => x())
  }

  public async getAll(): Promise<Collection[]> {
    const documents = await this.database.db.allDocs<CollectionsDBSchema>({
      startkey: 'collection::',
      endkey: 'collection::\uffff',
      include_docs: true,
    })
    return documents.rows.map(row => ({
      id: row.doc!._id.replace('collection::', ''),
      title: row.doc!.title,
      authors: row.doc!.authors,
      sources: row.doc!.sources,
      languages: row.doc!.languages,
      cover: row.doc!.cover,
    }))
  }
}
