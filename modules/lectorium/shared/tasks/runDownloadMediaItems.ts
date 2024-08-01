import { watch } from "vue"
import { useUserData } from "@lectorium/playlist"
import { Directory, Filesystem } from "@capacitor/filesystem"

export async function runDownloadMediaItems() {
  const data = useUserData()

  watch(data.media.changedAt, async () => {
    const mediaItems = await data.media.service.getAll()
    const fileToDownload = mediaItems.find(item => item.state === 'pending')

    console.log('fileToDownload', fileToDownload)

    if (!fileToDownload) { return }

    data.media.service.setState(fileToDownload!.id, 'downloading')
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
        await data.media.service.setState(fileToDownload!.id, 'downloaded', result.path)
        console.log('downloaded', fileToDownload)
      }
    } catch (error) {
      // TODO: set error state
      console.error('error downloading', error)
      await data.media.service.setState(fileToDownload!.id, 'pending')
    }
  }, { immediate: true })
}
