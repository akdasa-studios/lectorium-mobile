import { Reference, Source } from '@core/models'
import { Database } from '@core/persistence'

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


/**
 * Service for managing Sources
 */
export class SourcesService {
  private database = new Database({ name: 'library-dictionary-v0001' })

  /**
   * Returns Source by ID
   * @param id Source ID
   * @returns Source
   */
  async get(
    id: string
  ): Promise<Source> {
    const document = await this.database.db.get<SourcesDBSchema>(`source::${id}`)
    return {
      id: document._id,
      name: document.name
    }
  }

  /**
   * Returns all available Sources
   * @returns All available Sources
   */
  async getAll(): Promise<Source[]> {
    const result = (await this.database.db.allDocs<SourcesDBSchema>({
      startkey: 'source::',
      endkey: 'source::\uffff',
      include_docs: true
    })).rows.map(row => ({
      id: row.doc!._id.replace('source::', ''),
      name: row.doc!.name
    }))
    return result
  }

  /**
   * Returns short name of the Source
   * @param id Source ID
   * @param language Language code
   * @returns Short name of the Source
   */
  async getLocalizedShortName(
    id: string,
    language: string
  ): Promise<string> {
    const source = await this.get(id)
    return source.name[language].short
  }

  /**
   * Returns localized reference to the Source
   * @param reference Reference to the Source
   * @param language Language code to localize the reference
   * @returns Localized reference to the Source
   */
  async getLocalizedReference(
    reference: Reference,
    language: string
  ): Promise<string> {
    const source = reference[0]
    const sourceName = await this.getLocalizedShortName(source, language)
    return `${sourceName} ${reference.slice(1).join('.')}`
  }

  async getLocalizedReferences(
    references: Reference[],
    language: string,
  ): Promise<string[]> {
    if (!references) { return [] }
    return Promise.all(
      references.map(
        async x => await this.getLocalizedReference(x, language)
      )
    )
  }
}
