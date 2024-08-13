import { useLibrary } from "@lectorium/library"
import { useUserData } from "@lectorium/playlist"
import { MediaChangedEvent, PlaylistChangedEvent, useSync } from "@lectorium/shared"

/**
 * Background task that listens for changes in the playlist and
 * initiates the download of media files and transcripts.
 */
export function runDownloadMedia() {

  // ── Dependencies ────────────────────────────────────────────────────
  const data = useUserData()
  const library = useLibrary()
  const sync = useSync()

  // ── Dependencies ────────────────────────────────────────────────────
  data.playlistItems.service.onChange(handlePlaylistChange)
  data.media.service.onChange(handleMediaChange)

  // ── Handlers ────────────────────────────────────────────────────────
  async function handlePlaylistChange(
    event: PlaylistChangedEvent
  ) {
    const { trackId } = event.item;

    if (event.event === "added") {
      const track = await library.tracks.get(trackId);
      downloadTranscripts(trackId);
      enqueueMediaDownload(trackId, track.url);
    }
  }

  async function handleMediaChange(
    event: MediaChangedEvent
  ) {
    const { trackId } = event.item?.meta

    if (
      trackId &&
      event.event === "updated" &&
      event.item.state === "downloaded"
    ) {
      await updatePlaylistItemMediaStatus(trackId, "downloaded")
    }

  }

  // ── Helpers ─────────────────────────────────────────────────────────
  /**
   * Downloads the transcripts for the given track and marks the playlist
   * item as it has transcripts downloaded.
   * @param trackId Track Id
   */
  async function downloadTranscripts(trackId: string) {
    await sync.execute({
      trackTranscripts: {
        enabled: true,
        trackIds: [ trackId ]
      },
    })
    await data.playlistItems.service.setTranscriptStatus(trackId, "downloaded")
  }

  /**
   * Enqueues the media file for download.
   * @param trackId Track Id
   * @param url Url of the media file
   */
  async function enqueueMediaDownload(
    trackId: string,
    url: string,
  ) {
    // TODO: fix url parsing
    // @ts-ignore
    const extension = url.split(/[#?]/)[0].split('.').pop().trim()
    await data.media.service.queueDownload(
      url, `${trackId}.${extension}`, { trackId }
    )
  }

  /**
   * Updates the media status of the playlist item.
   * @param trackId Track Id
   * @param state State of the media file
   */
  async function updatePlaylistItemMediaStatus(
    trackId: string,
    state: "downloaded" | "unavailable"
  ) {
    await data.playlistItems.service.setMediaStatus(trackId, state)
  }
}
