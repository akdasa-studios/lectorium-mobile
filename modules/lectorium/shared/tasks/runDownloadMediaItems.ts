import { MediaItem } from "@core/models"
import { BackgroundDownloader, DownloadCompleteEvent } from "@core/plugins"
import { ItemChangedEvent, useMetrics, useUserData } from "@lectorium/shared"
import { useLogger } from "@lectorium/shared"


export function runDownloadMediaItems() {
  // ── Dependencies ────────────────────────────────────────────────────
  const { media } = useUserData()
  const logger = useLogger({ name: "task::downloadMediaItems" })
  const metrics = useMetrics()

  // ── Hooks ───────────────────────────────────────────────────────────
  media.subscribe(onMediaItemAdded)
  BackgroundDownloader.onDownloadComplete(onDownloadComplete)

  // ── Handlers ────────────────────────────────────────────────────────
  /**
   * New media item added. Start downloading it.
   * @param event Added media item
   */
  async function onMediaItemAdded(
    event: ItemChangedEvent<MediaItem>
  ) {
    if (event.event !== "added") return

    // Calculate file name and extension for local storage
    // @ts-ignore
    const extension = event.item.remoteUrl.split(/[#?]/)[0].split('.').pop().trim()
    const fileName = `${event.item._id.replace("media::", "")}.${extension}`

    // Start downloading the media item
    const response = await BackgroundDownloader.downloadFile({
      url: event.item.remoteUrl,
      title: event.item.title,
      fileName
    })
    logger.info(`Download started for ${event.item._id} from ` +
                `${event.item.remoteUrl} with ${response}`)

    // Update media item state with download ID and new state
    await media.updateState(event.item._id, {
      state:    'downloading',
      localUrl: response.localUrl,
      meta:     { ...event.item.meta, downloadId: response.downloadId }
    })

    // Update metrics
    metrics.increment('media.download.count', 1)
  }

  /**
   * Download complete event handler.
   * @param event Download complete event
   */
  async function onDownloadComplete(
    event: DownloadCompleteEvent
  ) {
    // Find media item by download ID
    const mediaItems = await media.getAll()
    const downloadedItem = mediaItems.find(item => item.meta.downloadId === event.downloadId)
    if (!downloadedItem) {
      logger.error(`Downloaded item not found for download ID ${event.downloadId}`)
      return
    } else {
      logger.info(`Download complete for ${downloadedItem._id} with ${event.fileUri}`)
    }

    // Update media item state with download result
    await media.updateState(downloadedItem._id, {
      size:     event.fileSize,
      state:    event.fileUri ? 'downloaded' : 'failed',
      localUrl: event.fileUri
    })

    // Update metrics
    metrics.increment('media.download.bytes', event.fileSize, { unit: 'byte' })
  }
}
