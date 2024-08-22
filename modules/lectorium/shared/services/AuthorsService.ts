import { Author } from '@core/models'
import { DatabaseService, Identifiable, ItemChangedEventHandler } from '@lectorium/shared'

export type AuthorDbScheme = {
  _id: string
  name: Record<string, string>
}

const authorSerializer = (item: Omit<Author, keyof Identifiable>): Omit<AuthorDbScheme, keyof Identifiable> => ({
  name: item.name,
})

const authorDeserializer = (document: AuthorDbScheme): Author => ({
  _id: document._id,
  name: document.name,
})

export class AuthorsService {
  private _databaseService = new DatabaseService<Author, AuthorDbScheme>
    ('library-dictionary-v0001', authorSerializer, authorDeserializer)

  /**
   * Retrieves an author by its id.
   * @param id Id of the author
   * @returns Author
   */
  public getOne(
    id: string
  ): Promise<Author> {
    return this._databaseService.getOne(`author::${id}`)
  }

  /**
   * Retrieves all authors.
   * @returns Array of authors
   */
  public async getAll(): Promise<Author[]> {
    return this._databaseService.getAll({
      startKey: 'author::',
      endKey: 'author::\uffff',
    })
  }
}
