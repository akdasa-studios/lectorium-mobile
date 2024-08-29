import { Event, EventHandler } from "@core/events"
import { Database } from "@core/persistence"

export type SyncProgressEvent = {
  ids: string[]
  percent: number
  state: 'working' | 'done'
  from: Database
  to: Database
}

export class SyncStep {
  private _from: Database
  private _to: Database
  private _progress: Event<SyncProgressEvent> = new Event()

  /**
   * Replicates data from one database to another.
   * @param from Replicate data from this database.
   * @param to Replicate data to this database.
   */
  constructor(
    from: Database,
    to: Database,
    onProgress?: EventHandler<SyncProgressEvent>
  ) {
    this._from = from
    this._to = to
    if (onProgress) { this._progress.subscribe(onProgress) }
  }

  /**
   * Gets the progress event.
   */
  get progress() {
    return this._progress
  }

  /**
   * Executes the replication task.
   * @param filter The filter function to be applied to the documents.
   * @param params The query parameters to be passed to the filter function.
   */
  async execute(
    filter?: string,
    params?: Record<string, any>,
  ): Promise<void> {
    let documentsCount = 0
    let documentsProcessed = 0

    await this._to.replicateFrom(this._from, {
      filter: filter || function(doc) {
        return !doc._id.startsWith('_design/');
      },
      query_params: params,
      onChange: (v) => {
        if (v.documentsPending && documentsCount === 0) {
          documentsCount = v.documentsPending + 100
        }
        documentsProcessed += v.docs.length

        this.progress.notify({
          ids: v.docs.map(doc => doc._id),
          percent: documentsCount > 0 ? documentsProcessed / documentsCount * 100 : 0,
          state: 'working',
          from: this._from,
          to: this._to,
        })
      }
    })

    this.progress.notify({
      ids: [],
      percent: 100,
      state: 'done',
      from: this._from,
      to: this._to,
    })
  }
}