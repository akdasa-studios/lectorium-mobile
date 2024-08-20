import { MediaItem } from "@core/models"
import { useUserData } from "@lectorium/playlist"
import { ItemChangedEvent, SyncEvent, useSync } from "@lectorium/shared"
import { useLogger } from "@lectorium/shared"

/**
 * Updates statuses of playlist items based on media and transcripts
 * download status. This task is used to keep the playlist items in sync
 * with the actual media and transcripts download status.
 */
export function runSyncPlaylistStatus() {
  // ── Dependencies ────────────────────────────────────────────────────
  const logger    = useLogger({ name: "task::syncPlaylistStatus" })
  const { media, playlistItems } = useUserData()
  const sync      = useSync()

  // ── Hooks ───────────────────────────────────────────────────────────
  media.subscribe(onMediaChange)
  sync.subscribe(onSyncChange)

  // ── Handlers ────────────────────────────────────────────────────────
  async function onMediaChange(
    event: ItemChangedEvent<MediaItem>
  ) {
    const { trackId } = event.item?.meta

    if (
      trackId &&
      event.event === "updated" &&
      event.item.state === "downloaded"
    ) {
      logger.info(`${trackId} -> media downloaded`)
      await playlistItems.service.setMediaStatus(trackId, "downloaded")
    }
  }

  async function onSyncChange(
    event: SyncEvent
  ) {
    if (event.database !== "transcripts") return
    const trackIds = event.ids.map(id => id.split("::")[0])

    for (const trackId of trackIds) {
      logger.info(`${trackId} -> transcript downloaded`)
      await playlistItems.service.setTranscriptStatus(trackId, "downloaded")
    }
  }
}