import { Track, TrackTranscript } from '@core/models'
import { Database, Repository } from '@core/persistence/Database'

export class LibraryRepository {
  private _db: Repository<Track>

  constructor() {
    this._db = new Repository<Track>(
      "track",
      new Database({ name: 'library' })
    )
  }

  async get(id: string): Promise<Track> {
    const entity = await this._db.get(`track::${id}::info`)
    return {
      //@ts-ignore
      id: entity._id.replace('track::', '').replace('::info', ''),
      title: entity.title,
      url: entity.url,
      location: entity.location,
      date: entity.date,
      references: entity.references,
      languages: entity.languages
    }
  }

  async getAll(): Promise<Track[]> {
    // TODO: filter on DB side instead of in memory

    //@ts-ignore
    const result = (await this._db.getAll()).filter(x => x._id.endsWith('::info')).map(x => ({
      //@ts-ignore
      id: x._id.replace('track::', '').replace('::info', ''),
      title: x.title,
      url: x.url,
      location: x.location,
      date: x.date,
      references: x.references,
      languages: x.languages
    }))
    return result
  }

  async getTranscript(
    trackId: string,
    language: string
  ): Promise<TrackTranscript> {
    const entity = await this._db.get(`track::${trackId}::transcript::${language}`)
    return {
      // TODO
      //@ts-ignore
      text: entity.text
    }
  }
}
