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
  private database: Database = new Database({ name: 'library'})

  async get(id: string): Promise<Track> {
    const entity = await this.database.db.get<TrackDBSchema>(`track::${id}::info`)
    return {
      id: entity._id.replace('track::', '').replace('::info', ''),
      title: entity.title,
      url: entity.url,
      location: entity.location,
      date: entity.date,
      references: entity.references,
      languages: entity.languages
    }
  }

  async getMany(ids: string[]): Promise<Track[]> {
    type t = { a: string } & { b: string }
    var z: t = { b: "123", a: "123" }


    const entities = await this.database.db.allDocs<TrackDBSchema>({
      keys: ids.map(id => `track::${id}::info`),
      include_docs: true,
      limit: 25,
      skip: 0,
    })

    // TODO: collection with "track::" in title may cause some issues
    return entities.rows
      .filter(x => "id" in x)
      .map((entity) => ({
        id: entity.doc!._id.replace('track::', '').replace('::info', ''),
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
    const entity = await this.database.db.get(`track::${trackId}::transcript::${language}`)
    return {
      // TODO
      //@ts-ignore
      text: entity.text
    }
  }
}
