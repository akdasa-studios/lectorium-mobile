import { Capacitor } from "@capacitor/core"
import { useUserData } from "@lectorium/playlist"
import { Directory, Filesystem } from "@capacitor/filesystem"
import { MediaChangedEvent, useLogger } from "@lectorium/shared"
import { App } from "@capacitor/app"


export async function runDownloader() {
  // ── Dependencies ────────────────────────────────────────────────────
  const data = useUserData()
  const logger = useLogger({ name: "task::downloader" })

  // ── State ───────────────────────────────────────────────────────────
  let loopIsRunning = false

  // ── Init ────────────────────────────────────────────────────────────
  // TODO: Handle app started event, if possible
  await onAppStarted()

  // ── Hooks ───────────────────────────────────────────────────────────
  data.media.service.onChange(onMediaChange)
  App.addListener('appStateChange', onAppStateChange)


  // ── Handlers ────────────────────────────────────────────────────────
  function onMediaChange(event: MediaChangedEvent) {
    if (event.event === 'added') {
      if (!loopIsRunning) { loop() }
    }
  }

  function onAppStateChange(state: { isActive: boolean }) {
    logger.info(`App state changed: ${state.isActive ? 'active' : 'inactive'}`)
    if (state.isActive && !loopIsRunning) { loop() }
  }

  async function onAppStarted() {
    const items = (await data.media.service.getAll()).filter(item => ['downloading', 'failed'].includes(item.state))
    logger.info(`Found ${items.length} media items in 'downloading' or 'failed' state`)
    for (const item of items) {
      await data.media.service.update(item.id, { state: 'pending' })
    }
    loop()
  }

  // ── Helpers ─────────────────────────────────────────────────────────
  async function loop() {
    loopIsRunning = true
    logger.info('Starting loop...')

    while (true) {
      // Find media item in the queue that is pending. Exit if none found.
      const items = (await data.media.service.getAll()).filter(item => item.state === 'pending')
      logger.info(`Found ${items.length} media items in 'pending' state`)

      const item = items.length > 0 ? items[0] : undefined
      if (!item) { break }

      // Item found, download it.
      logger.info(
        `Downloading ${item.id} from ${item.remoteUrl} ` +
        `to ${item.localPath} with ${item.meta || 'no meta'}`
      )
      await data.media.service.update(item.id, { state: 'downloading' })

      try {
        const result = await Filesystem.downloadFile({
          webFetchExtra: {
            mode: 'no-cors',
          },
          url: item.remoteUrl,
          path: item.localPath,
          directory: Directory.Data,
          recursive: true
        })
        if (!result.path) {
          throw new Error('Download failed')
        }

        const stat = await Filesystem.stat({
          path: result.path,
        })
        await data.media.service.update(item.id, {
          state: 'downloaded',
          size: stat.size,
          localUrl: Capacitor.convertFileSrc(result.path)
        })
      } catch (error) {
        logger.error('Error downloading file', error instanceof Error ? error.message : error)
        await data.media.service.update(item.id, {
          state: 'failed',
        })
      }
    }

    logger.info('Exiting loop...')
    loopIsRunning = false
  }
}
