import { Database } from "@core/persistence/Database";
import { ref } from "vue";

export function useLibrarySync() {
  const syncing = ref(false)

  async function sync() {
    syncing.value = true
    try {
      console.log('Syncing library...')
      const localDatabase = new Database({
        name: 'library',
      })
      await localDatabase.replicateFrom('https://app.lectorium.akdasa.studio/database/library')
    } catch (error) {
      console.error('Failed to sync library', error)
    } finally {
      syncing.value = false
      console.log('Library synced')
    }
  }

  return {
    syncing,
    sync,
  }
}