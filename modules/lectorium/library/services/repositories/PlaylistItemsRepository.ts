import { PlaylistItem } from '@core/models'

export class PlaylistItemsRepository {
  private items: PlaylistItem[] = [
    {
      id: "123",
      trackId: "1966-00-00 - Нью Йорк - БГ 02.12",
      order: 1,
    },
    {
      id: "124",
      trackId: "1966-00-00 - Нью-Йорк - БГ 02.48",
      order: 2,
    }
  ]

  public async addTrack(trackId: string): Promise<PlaylistItem> {
    const item = {
      id: "125",
      trackId,
      order: this.items.length + 1,
    }

    this.items.push(item)

    return item
  }

  public async add(item: PlaylistItem): Promise<void> {
    this.items.push(item)
  }

  public async getAll(): Promise<PlaylistItem[]> {
    return this.items
  }
}
