import { MediaItem } from "@core/models"
import { useLibrary } from "@lectorium/library"
import { useUserData } from "@lectorium/shared"
import { ItemChangedEvent, SyncProgressEvent, useSync } from "@lectorium/shared"
import { useLogger } from "@lectorium/shared"

/**
 * Updates statuses of playlist items based on media and transcripts
 * download status. This task is used to keep the playlist items in sync
 * with the actual media and transcripts download status.
 */
export function runSyncPlaylistStatus() {
  // ── Dependencies ────────────────────────────────────────────────────
  const sync      = useSync()
  const logger    = useLogger({ name: "task::syncPlaylistStatus" })
  const { media, playlist } = useUserData()
  const { transcripts } = useLibrary()

  // ── Hooks ───────────────────────────────────────────────────────────
  media.subscribe(onMediaChange)
  sync.progress.subscribe(onSyncTranscriptsComplete)

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
      await playlist.setMediaStatus(trackId, "downloaded")
    }
  }

  async function onSyncTranscriptsComplete(
    event: SyncProgressEvent
  ) {
    if (!event.to.db.name.startsWith("library-transcripts")) return
    if (event.state !== "done") return

    // Get all playlist items that don't have the transcript downloaded
    const playlistItems = await playlist.getAll()
    const withoutTranscript = playlistItems.filter(x => x.transcriptStatus !== "downloaded")

    // Check if the transcript is available for each track
    for (const playlistItem of withoutTranscript) {
      const items = await transcripts.getTranscripts(playlistItem.trackId)
      if (items) { // Transcript found, update the status
        logger.info(`${playlistItem.trackId} -> transcript downloaded`)
        await playlist.setTranscriptStatus(playlistItem.trackId, "downloaded")
      } else { // Transcript not found
        logger.error(`${playlistItem.trackId} -> transcript not found`)
      }
    }
  }
}
