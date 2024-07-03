import { watch, Ref, toRaw } from 'vue'
import { Storage } from '@ionic/storage'
import { useConfig } from '@lectorium/shared/composables'

export async function runConfigPersistence() {
  // --- Dependencies -----------------------------------
  const config = useConfig()

  // --- Initialization ---------------------------------
  const storage = new Storage({ name: 'config' })
  await storage.create()

  // Bind config to storage
  await bind(config.currentTrackId,       'player.current.id',       '')
  await bind(config.currentTrackPosition, 'player.current.position', 0)
  await bind(config.tracksQueue,          'player.queue', [])

  // --- Helpers ----------------------------------------
  async function bind<T>(config: Ref<T>, key: string, defaultValue: T) {
    config.value = await storage.get(key) || defaultValue
    watch(config, async (value) => {
      await storage.set(key, toRaw(value))
    }, { deep: true })
    console.log(`Bound ${key} to storage: ${config.value}`)
  }
}