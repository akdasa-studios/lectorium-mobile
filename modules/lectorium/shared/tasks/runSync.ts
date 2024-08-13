import { useUserData } from "@lectorium/playlist"
import { PlaylistChangedEvent, useSync } from "@lectorium/shared"

export function runSync() {
  const data = useUserData()
  const sync = useSync()

  data.playlistItems.service.onChange(handlePlaylistChange)

  async function handlePlaylistChange(event: PlaylistChangedEvent) {
    // sync track transcripts when a new item is added to the playlist
    await sync.execute({
      trackTranscripts: {
        enabled: true,
        trackIds: [ event.item.trackId ]
      },
    })
  }
}
