import { useLibrary } from "@lectorium/library"
import { useUserData } from "@lectorium/shared"
import { PlaylistChangedEvent } from "@lectorium/shared"
import { useLogger } from "@lectorium/shared"

/**
 * Creates or removes media items related to playlist items.
 */
export function runSyncMediaItemsWithPlaylist() {
  // ── Dependencies ────────────────────────────────────────────────────
  const logger  = useLogger({ name: "task::syncMediaItemsWithPlaylist" })
  const { media, playlist } = useUserData()
  const { tracks }          = useLibrary()

  // ── Hooks ───────────────────────────────────────────────────────────
  playlist.onChange(onPlaylistChange)

  // ── Handlers ────────────────────────────────────────────────────────
  async function onPlaylistChange(
    event: PlaylistChangedEvent
  ) {
    const { trackId } = event.item;
    const track = await tracks.getTrack(trackId)
    if (!track) return

    if (event.event === "added") {
      logger.info(`${trackId} -> added to playlist`)

      // @ts-ignore
      const extension = track.url.split(/[#?]/)[0].split('.').pop().trim()
      const fileName = `${trackId}.${extension}`
      await media.queueDownload(
        track.url, fileName, { trackId }
      )
    } else if (event.event === "removed") {
      logger.info(`${trackId} -> removed from playlist`)

      const relatedMedia = await media.getByUrl(track.url)
      if (relatedMedia) { media.removeOne(relatedMedia._id) }
    }
  }
}
