import { watch } from "vue"
import { useUserData } from "@lectorium/playlist"
import { Directory, Filesystem } from "@capacitor/filesystem"
import { Capacitor } from "@capacitor/core"

export async function runDownloadMediaItems() {
  const data = useUserData()

  watch(data.media.changedAt, async () => {
    const mediaItems = await data.media.service.getAll()
    const fileToDownload = mediaItems.find(item => item.state === 'pending')

    if (!fileToDownload) { return }

    data.media.service.update(fileToDownload.id, { state: 'downloading' })
    try {
      const result = await Filesystem.downloadFile({
        webFetchExtra: {
          mode: 'no-cors',
        },
        url: fileToDownload.remoteUrl,
        path: fileToDownload.localPath,
        directory: Directory.Data,
        recursive: true
      })

      if (result.path) {
        const stat = await Filesystem.stat({
          path: result.path,
          directory: Directory.Data
        })
        await data.media.service.update(fileToDownload.id, {
          state: 'downloaded',
          size: stat.size,
          localUrl: Capacitor.convertFileSrc(result.path)
        })
      }
    } catch (error) {
      // TODO: set error state
      await data.media.service.update(fileToDownload.id, {
        state: 'failed',
      })
    }
  }, { immediate: true })
}
