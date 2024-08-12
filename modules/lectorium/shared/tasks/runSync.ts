import { watch } from "vue"
import { useUserData } from "@lectorium/playlist"
import { useSync } from "@lectorium/shared"

export async function runSync() {
  const data = useUserData()
  const sync = useSync()

  watch(data.playlistItems.changedAt, async () => {
    await sync.execute({
      trackIds: await data.playlistItems.service.getTrackIds()
    })
  })
}
