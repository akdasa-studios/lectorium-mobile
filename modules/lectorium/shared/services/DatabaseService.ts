import { Database } from '@core/persistence'

export type Identifiable = { _id: string }

export type ItemChangedEvent<TItem> = {
  item: TItem,
  event: "added" | "removed" | "updated"
}

export type ItemChangedEventHandler<TItem> = (event: ItemChangedEvent<TItem>) => void

export type GetAllRequest = {
  startKey?: string
  endKey?: string
}

export class DatabaseService<
  TItem extends Identifiable,
  TDbScheme extends Identifiable,
> {
  private _databaseName: string
  private _database: Database
  private _changeEventHandlers: ItemChangedEventHandler<TItem>[] = []
  private _deserializer: (document: TDbScheme) => TItem
  private _serializer: (item: Omit<TItem, keyof Identifiable>) => Omit<TDbScheme, keyof Identifiable>

  /**
   * Constructs a new instance of the DatabaseService class.
   * @param {string} databaseName The name of the database.
   */
  constructor(
    databaseName: string,
    serializer: (item: Omit<TItem, keyof Identifiable>) => Omit<TDbScheme, keyof Identifiable>,
    deserializer: (document: TDbScheme) => TItem,
  ) {
    this._databaseName = databaseName
    this._database = new Database({ name: databaseName })
    this._serializer = serializer
    this._deserializer = deserializer
  }

  /**
   * Subscribes to item change events.
   * @param handler The event handler function to be called when an item changes.
   */
  public subscribe(
    handler: ItemChangedEventHandler<TItem>
  ) {
    // TODO: unsubscribe
    this._changeEventHandlers.push(handler)
  }

  /**
   * Retrieves a single item from the database based on the provided Id.
   * @param id The Id of the item to retrieve.
   * @returns A Promise that resolves to the retrieved item.
   * @throws Error if the item with the provided Id is not found in the database.
   */
  async getOne(
    id: string
  ): Promise<TItem> {
    const document = await this._database.db.get<TDbScheme>(id)
    if (!document) {
      throw new Error(`Document with Id ${id} on database ${this._databaseName} not found`)
    }
    return this._deserializer(document)
  }

  /**
   * Retrieves all items from the database.
   * @param request - Optional request parameters.
   * @returns A promise that resolves to an array of items.
   */
  async getAll(
    request?: GetAllRequest
  ): Promise<TItem[]> {
    const dbRequest: any = {}
    if (request?.startKey) { dbRequest.startkey = request.startKey }
    if (request?.endKey)   { dbRequest.endkey = request.endKey }

    const allDocs = await this._database.db.allDocs<TDbScheme>({
      ...dbRequest,
      include_docs: true
    })

    return allDocs.rows.map(row => this._deserializer(row.doc!))
  }

  /**
   * Adds an item to the database with the specified Id.
   * @param item The item to be added.
   * @returns A promise that resolves when the item is successfully added.
   */
  async addOne(
    item: TItem
  ): Promise<void> {
    try {
      await this._database.db.put({
        _id: item._id,
        ...this._serializer(item)
      })
    } catch (error) {
      console.error('Error adding item to database', error)
    }
    this.notifyChange({ item, event: 'added' })
  }

  /**
   * Updates a single item in the database.
   * @param id - The Id of the item to update.
   * @param item - The partial item object containing the updated properties.
   * @returns A promise that resolves to void when the update is complete.
   */
  async updateOne(
    id: string,
    item: Omit<TItem, keyof Identifiable>
  ): Promise<void> {
    const document = await this._database.db.get<TDbScheme>(id)
    const updatedDocument = { ...document, ...this._serializer(item) }
    const updatedItem = this._deserializer(updatedDocument)
    await this._database.db.put(updatedDocument)
    this.notifyChange({ item: updatedItem, event: 'updated' })
  }

  /**
   * Removes a document from the database.
   * @param id The ID of the document to be removed.
   * @returns A promise that resolves when the document is successfully removed.
   */
  async removeOne(
    id: string
  ): Promise<void> {
    const document = await this._database.db.get<TDbScheme>(id)
    const item = this._deserializer(document)
    await this._database.db.remove(document)
    this.notifyChange({ item, event: 'removed' })
  }

  /**
   * Notifies all subscribers of a change event.
   * @param event The event to be broadcasted to all subscribers.
   */
  private notifyChange(
    event: ItemChangedEvent<TItem>
  ) {
    for (const handler of this._changeEventHandlers) {
      handler(event)
    }
  }
}
