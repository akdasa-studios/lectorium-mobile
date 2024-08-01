import { watch } from "vue"
import { useUserData } from "@lectorium/playlist"
import { Directory, Filesystem } from "@capacitor/filesystem"
import { Capacitor } from "@capacitor/core"

export async function runDownloadMediaItems() {
  const data = useUserData()

  watch(data.media.changedAt, async () => {
    const mediaItems = await data.media.service.getAll()
    const fileToDownload = mediaItems.find(item => item.state === 'pending')

    console.log('fileToDownload', fileToDownload)

    if (!fileToDownload) { return }

    data.media.service.update(fileToDownload.id, { state: 'downloading' })
    try {
      const result = await Filesystem.downloadFile({
        webFetchExtra: {
          mode: 'no-cors',
        },
        url: fileToDownload.url,
        directory: Directory.Data,
        path: fileToDownload.path,
        recursive: true
      })

      if (result.path) {
        await data.media.service.update(fileToDownload.id, {
          state: 'downloaded',
          path: Capacitor.convertFileSrc(result.path)
        })
        console.log('downloaded', fileToDownload)
      }
    } catch (error) {
      // TODO: set error state
      console.error('Error downloading', error)
      await data.media.service.update(fileToDownload.id, {
        state: 'failed',
        error: error instanceof Error ? error.message : `Unknown error: ${error}`
      })
    }
  }, { immediate: true })
}
