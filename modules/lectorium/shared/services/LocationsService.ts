import { Location } from '@core/models'
import { Database } from '@core/persistence'
import { DatabaseService } from '@lectorium/shared'

/**
 * Schema of the Source documents in the Library collection.
 */
type LocationsDBSchema = {
  _id: string
  name: {
    [language: string]: string
  }
}

const locationSerializer   = (item: Location): LocationsDBSchema => item.props
const locationDeserializer = (document: LocationsDBSchema): Location => {
  const { _id, ...rest } = document
  return new Location({ _id: _id.replace("location::", ""), ...rest })
}


/**
 * Service for retrieving location information.
 */
export class LocationsService {
  private _databaseService: DatabaseService<Location, LocationsDBSchema>
  private _cache: Map<string, Location> = new Map()

  constructor(private database: Database) {
    this._databaseService = new DatabaseService(
      database, locationSerializer, locationDeserializer)
  }

  /**
   * Retrieves a location based on its ID.
   * @param id - The ID of the location.
   * @returns A Promise that resolves to the location.
   */
  async getOne(
    id: string
  ): Promise<Location> {
    const entity = (
      this._cache.get(id) ||
      await this._databaseService.getOne(`location::${id}`))
    this._cache.set(id, entity)
    return entity
  }

  /**
   * Retrieves all available locations.
   * @returns A Promise that resolves to all available locations.
   */
  async getAll(): Promise<Location[]> {
    return this._databaseService.getAll({
      startKey: 'location::',
      endKey: 'location::\uffff',
    })
  }
}
