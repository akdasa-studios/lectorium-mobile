import { Database } from '@core/persistence'

export type SyncTaskParams = {
  enabled: boolean
}

export interface SyncParams {
  dictionaryData?: SyncTaskParams
  trackInfos?: SyncTaskParams
  trackTranscripts?: {
    trackIds: string[]
  } & SyncTaskParams
  searchIndex?: SyncTaskParams
}

export type SyncProgress = {
  task: string
  documentsPending: number
  inProgress: boolean
}



class SyncStep {
  private _from: Database
  private _to: Database

  constructor(from: Database, to: Database) {
    this._from = from
    this._to = to
  }

  async execute(
    filter?: string,
    params?: Record<string, any>
  ): Promise<string[]> {
    const result: string[] = []

    await this._from.replicateFrom(this._to, {
      filter: filter || function(doc) {
        return !doc._id.startsWith('_design/');
      },
      query_params: params,
      onChange(v) {
        v.docs.forEach(doc => { result.push(doc._id) })
      }
    })

    return result
  }
}
export type SyncEvent = {
  database: string
  ids: string[]
}

export type SyncEventHandler = (event: SyncEvent) => void

export class SyncService {
  private _context: Record<string, Database> = {}
  private _syncEventHandlers: SyncEventHandler[] = []

  constructor(serverBaseUrl: string) {
    this._context["local.tracks"]       = new Database({ name: 'library-tracks-v0001' })
    this._context["local.transcripts"]  = new Database({ name: 'library-transcripts-v0001' })
    this._context["local.dictionary"]   = new Database({ name: 'library-dictionary-v0001' })
    this._context["local.index"]        = new Database({ name: 'library-index-v0001' })

    this._context["remote.tracks"]      = new Database({ name: serverBaseUrl + '/library-tracks-v0001' })
    this._context["remote.transcripts"] = new Database({ name: serverBaseUrl + '/library-transcripts-v0001' })
    this._context["remote.dictionary"]  = new Database({ name: serverBaseUrl + '/library-dictionary-v0001' })
    this._context["remote.index"]       = new Database({ name: serverBaseUrl + '/library-index-v0001' })
  }

  public subscribe(
    handler: SyncEventHandler
  ) {
    // TODO: unsubscribe
    this._syncEventHandlers.push(handler)
  }

  /**
   * Notifies all subscribers of a change event.
   * @param event The event to be broadcasted to all subscribers.
   */
  private notifyChange(
    event: SyncEvent
  ) {
    for (const handler of this._syncEventHandlers) {
      handler(event)
    }
  }

  async execute(
    params?: SyncParams,
  ) {
    try {
      // Replicate dictionary data
      if (params?.dictionaryData?.enabled) {
        const ids = await new SyncStep(
          this._context["local.dictionary"],
          this._context["remote.dictionary"]
        ).execute()
        this.notifyChange({ database: 'dictionary', ids })
      }

      // Replicate track infos data
      if (params?.trackInfos?.enabled) {
        const ids = await new SyncStep(
          this._context["local.tracks"],
          this._context["remote.tracks"]
        ).execute()
        this.notifyChange({ database: 'tracks', ids })
      }

      // Replicate track transcripts data
      if (params?.trackTranscripts?.enabled) {
        const ids = await new SyncStep(
          this._context["local.transcripts"],
          this._context["remote.transcripts"],
        ).execute(
          'library/by_id',
          { ids: params.trackTranscripts.trackIds }
        )
        this.notifyChange({ database: 'transcripts', ids })
      }

      // Replicate Library Index database
      if (params?.searchIndex?.enabled) {
        const ids = await new SyncStep(
          this._context["local.index"],
          this._context["remote.index"]
        ).execute()
        this.notifyChange({ database: 'index', ids })
      }
    } catch (error) {
      console.error("Unable to sync data", error)
    } finally {
      console.log("Sync complete...")
    }
  }
}
