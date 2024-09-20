import { Track } from '@core/models'
import { Database } from '@core/persistence'
import { DatabaseService } from '@lectorium/shared'

/**
 * Schema of the Track documents in the Library collection.
 */
type TracksDBSchema = {
  _id: string
  title: Record<string, string>
  url: string
  location: string
  date: [number, number, number]
  references: Array<string[]>
  languages: Array<{
    language: string,
    source: 'track' | 'transcript',
    type: 'original' | 'generated' | 'redacted'
  }>
  author: string
}

const trackSerializer   = (item: Track): TracksDBSchema => (item.props)
const trackDeserializer = (document: TracksDBSchema): Track => new Track(document)


/**
 * Service for managing Tracks
 */
export class TracksService {
  private _databaseService: DatabaseService<Track, TracksDBSchema>
  private _cache: Map<string, Track> = new Map()

  constructor(database: Database) {
    this._databaseService = new DatabaseService(
      database, trackSerializer, trackDeserializer)
  }

  /**
   * Returns Track by ID
   * @param id Track ID
   * @returns Track
   */
  async getOne(
    id: string
  ): Promise<Track> {
    const entity = (
      this._cache.get(id) ||
      await this._databaseService.getOne(id))
    this._cache.set(id, entity)
    return entity
  }

  async getAll(request: { skip: number, limit: number }): Promise<Track[]> {
    return this._databaseService.getAll(request)
  }

  async getMany(ids: string[]): Promise<Track[]> {
    return this._databaseService.getMany({ ids })
  }

  async getCount(): Promise<number> {
    return this._databaseService.getCount()
  }
}
