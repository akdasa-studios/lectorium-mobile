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


export type TracksFilter = {
  ids?: string[]
  authors?: string[]
  locations?: string[]
  sources?: string[]
  languages?: string[]
  duration?: { min: number, max: number }
  dates?: { from: string, to: string }
}

export type Pagination = {
  skip: number
  limit: number
}

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

  async getAll(request: Pagination): Promise<Track[]> {
    return this._databaseService.getAll(request)
  }

  async getMany(request: TracksFilter & Pagination): Promise<Track[]> {
    const selector: any = {}

    if (request.ids)       { selector._id = { $in: request.ids } }
    if (request.authors)   { selector.author = { $in: request.authors } }
    if (request.locations) { selector.location = { $in: request.locations } }
    if (request.sources)   { selector.references = { $elemMatch: { 0: { $in: request.sources } } } }
    if (request.languages) {
      selector.languages = {
        $elemMatch: {
          language: { $in: request.languages },
          source:   { $eq: 'track' }
        }
      }
    }
    if (request.dates) {
      // convert iso date to array of [year, month, day]
      const date = (iso: string) => {
        const d = new Date(iso)
        return [d.getFullYear(), d.getMonth()+1, d.getDate()]
      }

      selector.date = {
        $gte: date(request.dates.from),
        $lte: date(request.dates.to),
      }
    }
    if (request.duration) {
      selector.duration = {
        $gte: request.duration.min,
        $lte: request.duration.max,
      }
    }

    console.log(selector)

    return this._databaseService.getMany({
      selector, limit: request.limit, skip: request.skip
    })
  }

  async getCount(): Promise<number> {
    return this._databaseService.getCount()
  }
}
