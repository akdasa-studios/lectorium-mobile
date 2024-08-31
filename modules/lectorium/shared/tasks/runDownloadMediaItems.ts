import { MediaItem } from "@core/models"
import { BackgroundDownloader, DownloadCompleteEvent } from "@core/plugins"
import { useMetrics, useUserData } from "@lectorium/shared"
import { useLogger } from "@lectorium/shared"


export function runDownloadMediaItems() {
  // ── Dependencies ────────────────────────────────────────────────────
  const { media } = useUserData()
  const logger = useLogger({ name: "task::downloadMediaItems" })
  const metrics = useMetrics()

  // ── Hooks ───────────────────────────────────────────────────────────
  media.subscribe(e => e.event === "added" && onMediaItemAdded(e.item))
  // media.subscribe(e => e.event === "updated" && onMediaItemUpdated(e.item))
  BackgroundDownloader.onDownloadComplete(onDownloadComplete)

  // ── Handlers ────────────────────────────────────────────────────────
  /**
   * New media item added. Start downloading it.
   * @param item Added media item
   */
  async function onMediaItemAdded(
    item: MediaItem
  ) {
    // Calculate file name and extension for local storage
    // @ts-ignore
    const extension = item.remoteUrl.split(/[#?]/)[0].split('.').pop().trim()
    const fileName = `${item._id.replace("media::", "")}.${extension}`

    // Start downloading the media item
    const response = await BackgroundDownloader.downloadFile({
      url: item.remoteUrl,
      title: item.title,
      fileName
    })
    logger.info(`Download started for ${item._id} from ` +
                `${item.remoteUrl} with ${response}`)

    // Update media item state with download ID and new state
    await media.updateState(item._id, {
      state:    'downloading',
      localUrl: response.localUrl,
      meta:     { ...item.meta, downloadId: response.downloadId }
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
