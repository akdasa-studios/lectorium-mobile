import PouchDB from 'pouchdb'

export interface DatabaseConfig {
  name: string,
  adapter?: string,
}

export interface DatabaseReplicationChangeEvent {
  documentsPending: number
}

export interface DatabaseReplicationOptions {
  filter: string,
  query_params?: Record<string, any>
  style?: string
  onChange?: (event: DatabaseReplicationChangeEvent) => void
}

export class Database {
  private _db: PouchDB.Database
  private _config: DatabaseConfig

  /**
   * Initialize a new database using the given configuration
   * @param config Database configuration
   */
  constructor(
    config: DatabaseConfig
  ) {
    this._config = config
    this._db = new PouchDB(this._config.name, {
      adapter: this._config.adapter
    })
  }

  /**
   * Replicate the local database from a remote database
   * @param remote Remote database URL
   */
  async replicateFrom(
    source: Database,
    options?: DatabaseReplicationOptions,
  ) {
    await this._db.replicate.from(source.db, options).on('change', info => {
      options?.onChange && options.onChange({
        // @ts-ignore
        documentsPending: info.pending || 0
      })
    })
  }

  /**
   * Get the underlying PouchDB instance
   */
  get db() { return this._db }
}

export class Repository<TEntity extends object> {
  constructor(
    private _collectionName: string,
    private _db: Database
  ) { }

  protected get db() { return this._db.db }

  async get(id: string): Promise<TEntity> {
    return await this.db.get(id)
  }

  async put(doc: TEntity) {
    return await this.db.put(doc)
  }

  async getAll(): Promise<TEntity[]> {
    const result = await this.db.allDocs<TEntity>({
      startkey: `${this._collectionName}`,
      endkey: `${this._collectionName}\uffff`,
      include_docs: true
    })
    return result.rows.map(row => row.doc!)
  }
}