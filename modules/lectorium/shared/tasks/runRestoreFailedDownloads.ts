import { useMetrics, useUserData } from "@lectorium/shared"
import { useLogger } from "@lectorium/shared"
import { App } from "@capacitor/app"

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
    if (mediaItemsToUpdate.length === 0) { return }

    logger.info(`Found ${mediaItemsToUpdate.length} media items in ${states.join(", ")} state`)
    for (const item of mediaItemsToUpdate) {
      await media.updateState(item._id, { state: 'pending' })
    }
    metrics.increment('media.download.restored', mediaItemsToUpdate.length)
  }
}
