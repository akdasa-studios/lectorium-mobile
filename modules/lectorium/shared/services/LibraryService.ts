import { Track, TrackTranscript} from '@core/models'
import { Database } from '@core/persistence/Database'

type TrackDBSchema = {
  _id: string,
  title: string,
  url: string,
  location: string,
  date: string,
  references: any,
  languages: any,
}

export class LibraryService {
  private _libraryTracks: Database = new Database({ name: 'library-tracks-v0001' })
  private _libraryTranscripts: Database = new Database({ name: 'library-transcripts-v0001' })
  // private _libraryDictionary: Database = new Database({ name: 'library-dictionary' })

  /**
   * Returns a track by its id.
   * @param id Track Id
   * @returns One track
   */
  async getTrack(
    id: string
  ): Promise<Track> {
    const entity = await this._libraryTracks.db.get<TrackDBSchema>(id)
    return {
      id: id,
      title: entity.title,
      url: entity.url,
      location: entity.location,
      date: entity.date,
      references: entity.references,
      languages: entity.languages
    }
  }

  /**
   * Returns all tracks.
   * @returns Array of tracks
   */
  async getAll(): Promise<Track[]> {
    return (await this._libraryTracks.db.allDocs<TrackDBSchema>({
      include_docs: true,
      limit: 25,
      skip: 0,
    })).rows.map((entity) => ({
      id: entity.doc!._id,
      title: entity.doc!.title,
      url: entity.doc!.url,
      location: entity.doc!.location,
      date: entity.doc!.date,
      references: entity.doc!.references,
      languages: entity.doc!.languages
    }))
  }

  async getMany(
    ids: string[]
  ): Promise<Track[]> {
    const entities = await this._libraryTracks.db.allDocs<TrackDBSchema>({
      keys: ids,
      include_docs: true,
      limit: 25,
      skip: 0,
    })

    return entities.rows
      .filter(x => "id" in x)
      .map((entity) => ({
        id: entity.doc!._id,
        title: entity.doc!.title,
        url: entity.doc!.url,
        location: entity.doc!.location,
        date: entity.doc!.date,
        references: entity.doc!.references,
        languages: entity.doc!.languages
      }))
  }

  async getTranscript(
    trackId: string,
    language: string
  ): Promise<TrackTranscript> {
    const entity = await this._libraryTranscripts.db.get(`${trackId}::${language}`)
    return {
      // TODO
      //@ts-ignore
      text: entity.text
    }
  }

  async getTranscripts(
    trackId: string
  ): Promise<TrackTranscript[]> {
    const entities = await this._libraryTranscripts.db.allDocs({
      startkey: `${trackId}::`,
      endkey: `${trackId}::\uffff`,
      include_docs: true
    })

    return entities.rows.map((entity) => ({
      // TODO
      //@ts-ignore
      text: entity.doc.text
    }))
  }
}
