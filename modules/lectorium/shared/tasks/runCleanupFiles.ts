import { useUserData } from "@lectorium/playlist"
import { ItemChangedEvent, useFilesService, useLogger } from "@lectorium/shared"
import { MediaItem } from "@core/models"

/**
 * Background task that removes files from the filesystem when related
 * MediaItem is removed.
 */
export async function runCleanupFiles() {
  // ── Dependencies ────────────────────────────────────────────────────
  const { media } = useUserData()
  const logger = useLogger({ name: "task::cleanupFiles" })
  const filesService = useFilesService()

  // ── Hooks ───────────────────────────────────────────────────────────
  media.subscribe(onMediaChange)

  // ── Handlers ────────────────────────────────────────────────────────
  function onMediaChange(event: ItemChangedEvent<MediaItem>) {
    if (event.event === 'removed') {
      logger.info(`${event.item.localPath} -> removing`)
      filesService.deleteFile(event.item.localPath)
    }
  }
}