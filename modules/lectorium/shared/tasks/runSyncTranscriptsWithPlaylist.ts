import { useLibrary } from "@lectorium/library"
import { useUserData } from "@lectorium/shared"
import { PlaylistChangedEvent, useSync } from "@lectorium/shared"
import { useLogger } from "@lectorium/shared"

/**
 * Syncs transcripts with playlist items. When a new track is added to the
 * playlist, this task will download related transcripts.
 */
export function runSyncTranscriptsWithPlaylist() {
  // ── Dependencies ────────────────────────────────────────────────────
  const logger  = useLogger({ name: "task::syncTranscriptsWithPlaylist" })
  const data    = useUserData()
  const sync    = useSync()
  let runSyncTimeout: NodeJS.Timeout | undefined = undefined

  // ── Hooks ───────────────────────────────────────────────────────────
  data.playlist.onChange(onPlaylistChange)

  // ── Handlers ────────────────────────────────────────────────────────
  async function onPlaylistChange(
    event: PlaylistChangedEvent
  ) {
    const { trackId } = event.item;

    if (event.event === "added") {
      logger.info(`${trackId} -> added to playlist`)

      if (runSyncTimeout) {
        logger.info("to many requests, waiting for 5 seconds")
        clearTimeout(runSyncTimeout)
      }

      runSyncTimeout = setTimeout(async () => {
        logger.info("syncing transcripts")
        await sync.execute({
          trackTranscripts: {
            enabled: true,
            trackIds: await data.playlist.getTrackIds(),
          },
        })
      }, 5000)


    }
    // TODO: remove transcript
  }
}
