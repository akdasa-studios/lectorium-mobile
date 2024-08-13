import { useLibrary } from "@lectorium/library"
import { useUserData } from "@lectorium/playlist"
import { MediaChangedEvent, PlaylistChangedEvent, useSync } from "@lectorium/shared"
import { useLogger } from "@lectorium/shared"

const MISSED_TRANSCRIPT_STATES = ["unknown", "available"]

/**
 * Background task that downloads media files and transcripts for the tracks
 * to make them available offline.
 */
export function runDownloadMedia() {
  // ── Dependencies ────────────────────────────────────────────────────
  const logger  = useLogger({ name: "task::offline" })
  const data    = useUserData()
  const library = useLibrary()
  const sync    = useSync()

  // ── Init ────────────────────────────────────────────────────────────
  // TODO: use app started event if available
  onAppStarted()

  // ── Hooks ───────────────────────────────────────────────────────────
  data.playlistItems.service.onChange(onPlaylistChange)
  data.media.service.onChange(onMediaChange)

  // ── Handlers ────────────────────────────────────────────────────────
  async function onAppStarted() {
    await downloadMissedTranscripts()
  }

  async function onPlaylistChange(
    event: PlaylistChangedEvent
  ) {
    const { trackId } = event.item;

    if (event.event === "added") {
      const track = await library.tracks.get(trackId)
      downloadTranscripts([trackId])
      downloadMediaFiles(trackId, track.url)
    }
  }

  async function onMediaChange(
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
  async function downloadTranscripts(
    trackId: string[]
  ) {
    logger.info(`Downloading transcripts for track ${trackId}`)

    await sync.execute({
      trackTranscripts: {
        enabled: true,
        trackIds: trackId
      },
    })
    for (const id of trackId) {
      await updatePlaylistItemTranscriptStatus(id, "downloaded")
    }
  }

  /**
   * Downloads the transcripts for the tracks that are missing transcripts.
   */
  async function downloadMissedTranscripts() {
    const items = await data.playlistItems.service.getAll()
    const trackIds = items
      .filter(x => MISSED_TRANSCRIPT_STATES.includes(x.transcriptStatus))
      .map(x => x.trackId)
    logger.info(`Found ${trackIds.length} tracks without transcripts`)
    await downloadTranscripts(trackIds)
  }

  /**
   * Enqueues the media file for download.
   * @param trackId Track Id
   * @param url Url of the media file
   */
  async function downloadMediaFiles(
    trackId: string,
    url: string,
  ) {
    logger.info(`Enqueueing media download for track ${trackId}`)

    // TODO: fix url parsing
    // @ts-ignore
    const extension = url.split(/[#?]/)[0].split('.').pop().trim()
    const fileName = `${trackId}.${extension}`
    await data.media.service.queueDownload(
      url, fileName, { trackId }
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
    logger.info(`Media file for track ${trackId} is ${state}`)

    await data.playlistItems.service.setMediaStatus(trackId, state)
  }

  /**
   * Updates the media status of the playlist item.
   * @param trackId Track Id
   * @param state State of the media file
   */
  async function updatePlaylistItemTranscriptStatus(
    trackId: string,
    state: "downloaded" | "unavailable"
  ) {
    logger.info(`Transcripts for track ${trackId} is ${state}`)

    await data.playlistItems.service.setTranscriptStatus(trackId, state)
  }
}
