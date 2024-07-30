import { Location, LocationName } from '@core/models'
import { Database } from '@core/persistence'

/**
 * Schema of the Source documents in the Library collection.
 */
type LocationsDBSchema = {
  _id: string
  name: {
    [language: string]: string
  }
}


/**
 * Service for retrieving location information.
 */
export class LocationsService {
  private database = new Database({ name: 'library' })

  /**
   * Retrieves a location based on its ID.
   * @param id - The ID of the location.
   * @returns A Promise that resolves to the location.
   */
  async get(
    id: string
  ): Promise<Location> {
    const document = await this.database.db.get<LocationsDBSchema>(`location::${id}`)
    return {
      id: document._id,
      name: document.name
    }
  }

  /**
   * Retrieves all available locations.
   * @returns A Promise that resolves to all available locations.
   */
  async getAll(): Promise<Location[]> {
    return (await this.database.db.allDocs<LocationsDBSchema>({
      startkey: 'location::',
      endkey: 'location::\uffff',
      include_docs: true
    })).rows.map(row => ({
      id: row.doc!._id.replace('location::', ''),
      name: row.doc!.name
    }))
  }

  /**
   * Retrieves the localized name of a location based on its ID and language.
   * @param id - The ID of the location.
   * @param language - The language code for the desired localization.
   * @returns A Promise that resolves to the localized name of the location.
   */
  async getLocalizedName(
    id: string,
    language: string
  ): Promise<LocationName> {
    const source = await this.get(id)
    return source.name[language]
  }
}
