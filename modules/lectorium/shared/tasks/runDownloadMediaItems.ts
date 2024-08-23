import { useMetrics, useUserData } from "@lectorium/shared"
import { ItemChangedEvent, useFilesService, useLogger } from "@lectorium/shared"
import { MediaItem } from "@core/models"


export async function runDownloadMediaItems() {
  // ── Dependencies ────────────────────────────────────────────────────
  const { media } = useUserData()
  const logger = useLogger({ name: "task::downloadMediaItems" })
  const filesService = useFilesService()
  const metrics = useMetrics()

  // ── State ───────────────────────────────────────────────────────────
  let loopIsRunning = false

  // ── Hooks ───────────────────────────────────────────────────────────
  media.subscribe(onMediaChange)

  // ── Handlers ────────────────────────────────────────────────────────
  function onMediaChange(event: ItemChangedEvent<MediaItem>) {
    if (event.event === 'added' || event.event === 'updated') {
      if (!loopIsRunning) { loop() }
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────
  async function loop() {
    loopIsRunning = true

    while (true) {
      // Find media item in the queue that is pending. Exit if none found.
      const pending = await media.getPending()
      logger.info(`Found ${pending.length} media items in 'pending' state`)

      const item = pending[0];
      if (!item) { break }

      // Item found, download it.
      logger.info(
        `Downloading ${item._id} from ${item.remoteUrl} ` +
        `to ${item.localPath} with ${JSON.stringify(item.meta) || 'no meta'}`
      )
      await media.updateState(item._id, { state: 'downloading' })

      try {
        const startTime = Date.now()
        const downloadedFile = await filesService.downloadFile(item.remoteUrl, item.localPath)
        const endTime = Date.now()

        await media.updateState(item._id, {
          state: 'downloaded',
          size: downloadedFile.size,
          localUrl: downloadedFile.localUrl,
        })
        metrics.increment('media.download.count', 1)
        metrics.increment('media.download.bytes', downloadedFile.size, { unit: 'byte' })
        metrics.distribution('media.download.duration', endTime - startTime, { unit: 'millisecond' })
      } catch (error) {
        logger.error('Error downloading file', error instanceof Error ? error.message : error)
        metrics.increment('media.download.error', 1)
        await media.updateState(item._id, { state: 'failed', })
      }
    }

    loopIsRunning = false
  }
}
