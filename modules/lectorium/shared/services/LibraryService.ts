import { TrackTranscript} from '@core/models'
import { Database } from '@core/persistence/Database'

export class LibraryService {
  constructor(
    private _libraryTranscripts: Database,
  ) {}

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
