export type EventHandler<TEvent> = (event: TEvent) => void

/**
 * Represents an event that can be subscribed to by multiple handlers.
 * @template TEvent The type of the event.
 */
export class Event<TEvent> {
  private _handlers: EventHandler<TEvent>[] = []

  /**
   * Subscribes a handler function to the event.
   * @param handler The handler function to be subscribed.
   */
  public subscribe(
    handler: EventHandler<TEvent>
  ) {
    // TODO: unsubscribe
    this._handlers.push(handler)
  }

  /**
   * Notifies all subscribers of a change event.
   * @param event The event to be broadcasted to all subscribers.
   */
  public notify(
    event: TEvent
  ) {
    for (const handler of this._handlers) {
      handler(event)
    }
  }
}
