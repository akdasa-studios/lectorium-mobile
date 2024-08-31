import { useMetrics, useUserData } from "@lectorium/shared"
import { useLogger } from "@lectorium/shared"
import { App } from "@capacitor/app"
import { Filesystem } from "@capacitor/filesystem"

/**
 * Background task that marks all media items in 'downloading' and 'failed'
 * states as 'pending' to be re-downloaded.
 */
export function runRestoreFailedDownloads() {
  // ── Dependencies ────────────────────────────────────────────────────
  const { media } = useUserData()
  const logger = useLogger({ name: "task::restoreFailedDownloads" })
  const metrics = useMetrics()

  // ── Init ────────────────────────────────────────────────────────────
  markAsPending(['downloading', 'failed'])

  // ── Hooks ───────────────────────────────────────────────────────────
  App.addListener(
    'appStateChange',
    (v) => v.isActive && markAsPending(["failed"])
  )

  // ── Helpers ─────────────────────────────────────────────────────────
  async function markAsPending(states: string[]) {
    const mediaItems = await media.getAll()
    const mediaItemsToUpdate = mediaItems.filter(item => states.includes(item.state))
    logger.info(`Found ${mediaItemsToUpdate.length} media items in ${states.join(", ")} state`)

    if (mediaItemsToUpdate.length === 0) { return }

    for (const item of mediaItemsToUpdate) {
      if (item.localUrl) {
        // Check if the file already downloaded
        try {
          const stat = await Filesystem.stat({ path: item.localUrl })
          await media.updateState(item._id, { state: 'downloaded', size: stat.size })
          logger.info(`Restored ${item._id} from ${item.state} to downloaded`)
        } catch (error) {
          logger.info(`Failed to restore ${item._id} at ${item.localUrl} from ${item.state} to downloaded: ${error}`)
        }
      } else {
        // Download was not started yet or failed, mark as pending
        await media.updateState(item._id, { state: 'pending' })
      }
    }
    metrics.increment('media.download.restored', mediaItemsToUpdate.length)
  }
}
