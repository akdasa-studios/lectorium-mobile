import { Event } from '@core/events'
import { Database } from '@core/persistence'
import { SyncProgressEvent, SyncStep } from './SyncStep'

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

export type SyncDatabases = {
  local: {
    tracks: Database
    transcripts: Database
    dictionary: Database
    index: Database
  },
  remote: {
    tracks: Database
    transcripts: Database
    dictionary: Database
    index: Database
  }
}


export class SyncService {
  private _context: SyncDatabases
  private _progress: Event<SyncProgressEvent> = new Event()

  constructor(context: SyncDatabases) {
    this._context = context
  }

  get progress() { return this._progress }

  async execute(
    params?: SyncParams,
  ) {
    const steps: Promise<void>[] = []

    try {
      // Replicate dictionary data
      if (params?.dictionaryData?.enabled) {
        steps.push(new SyncStep(
          this._context.remote.dictionary,
          this._context.local.dictionary,
          (progress) => this.progress.notify(progress)
        ).execute())
      }

      // Replicate track infos data
      if (params?.trackInfos?.enabled) {
        steps.push(new SyncStep(
          this._context.remote.tracks,
          this._context.local.tracks,
          (progress) => this.progress.notify(progress)
        ).execute())
      }

      // Replicate track transcripts data
      if (params?.trackTranscripts?.enabled) {
        steps.push(new SyncStep(
          this._context.remote.transcripts,
          this._context.local.transcripts,
          (progress) => this.progress.notify(progress)
        ).execute(
          'library/by_id',
          { ids: params.trackTranscripts.trackIds }
        ))
      }

      // Replicate Library Index database
      if (params?.searchIndex?.enabled) {
        steps.push(new SyncStep(
          this._context.remote.index,
          this._context.local.index,
          (progress) => this.progress.notify(progress)
        ).execute(undefined, undefined))
      }

      await Promise.all(steps)
    } catch (error) {
      console.error("Unable to sync data", JSON.stringify(error))
    } finally {
      console.log("Sync complete...")
    }
  }
}
