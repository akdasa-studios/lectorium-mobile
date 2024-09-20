import { Source } from '@core/models'
import { Database } from '@core/persistence'
import { DatabaseService } from '@lectorium/shared'

/**
 * Schema of the Source documents in the Library collection.
 */
type SourcesDBSchema = {
  _id: string
  name: {
    [language: string]: {
      full: string
      short: string
    }
  }
}

const sourceSerializer   = (item: Source): SourcesDBSchema => item.props
const sourceDeserializer = (document: SourcesDBSchema): Source => new Source(document)


/**
 * Service for managing Sources
 */
export class SourcesService {
  private _databaseService: DatabaseService<Source, SourcesDBSchema>
  private _cache: Map<string, Source> = new Map()

  constructor(database: Database) {
    this._databaseService = new DatabaseService(
      database, sourceSerializer, sourceDeserializer)
  }

  /**
   * Returns Source by ID
   * @param id Source ID
   * @returns Source
   */
  async getOne(
    id: string
  ): Promise<Source> {
    const entity = (
      this._cache.get(id) ||
      await this._databaseService.getOne(`source::${id}`))
    this._cache.set(id, entity)
    return entity
  }

  /**
   * Returns all available Sources
   * @returns All available Sources
   */
  async getAll(): Promise<Source[]> {
    return this._databaseService.getAll({
      startKey: 'source::',
      endKey: 'source::\uffff',
    })
  }
}
