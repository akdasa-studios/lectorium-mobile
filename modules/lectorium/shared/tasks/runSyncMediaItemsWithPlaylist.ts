import { cyrb53 } from "@core/utils"
import { useLibrary } from "@lectorium/library"
import { useConfig, useUserData } from "@lectorium/shared"
import { PlaylistChangedEvent, useSignedUrlGenerator } from "@lectorium/shared"
import { useLogger } from "@lectorium/shared"

/**
 * Creates or removes media items related to playlist items.
 */
export function runSyncMediaItemsWithPlaylist() {
  // ── Dependencies ────────────────────────────────────────────────────
  const logger              = useLogger({ name: "task::syncMediaItemsWithPlaylist" })
  const config              = useConfig()
  const signedUrlGenerator  = useSignedUrlGenerator()
  const { media, playlist } = useUserData()
  const { tracks }          = useLibrary()

  // ── Hooks ───────────────────────────────────────────────────────────
  playlist.onChange(onPlaylistChange)

  // ── Handlers ────────────────────────────────────────────────────────
  async function onPlaylistChange(
    event: PlaylistChangedEvent
  ) {
    const { trackId } = event.item;
    const track = await tracks.getOne(trackId)
    if (!track) return

    if (event.event === "added") {
      logger.info(`${trackId} -> added to playlist`)

      // If track is sitored on S3, generate signed URL
      // to download it to the device.
      const url = track.url.startsWith("https")
        ? track.url
        : await signedUrlGenerator.signUrl(track.url)

      // Queue the media item for download.
      await media.queueDownload(
        cyrb53(track.url).toString(), // use static track.url as a key
        track.getTitle(config.locale.value),
        url, { trackId }
      )
    } else if (event.event === "removed") {
      logger.info(`${trackId} -> removed from playlist`)

      const relatedMedia = await media.getById(cyrb53(track.url).toString())
      if (relatedMedia) { media.removeOne(relatedMedia._id) }
    }
  }
}
