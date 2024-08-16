import { createGlobalState } from '@vueuse/core'
import { useConfig } from './useConfig'
import { SyncEventHandler, SyncParams, SyncService } from '@lectorium/shared'


export const useSync = createGlobalState(() => {

  // ── Dependencies ────────────────────────────────────────────────────
  const config = useConfig()
  const service = new SyncService(config.serverBaseUrl.value)

  // ── Helpers ─────────────────────────────────────────────────────────
  function subscribe(handler: SyncEventHandler) {
    service.subscribe(handler)
  }

  async function execute(
    params: SyncParams,
    // progress?: (value: SyncProgress) => void,
  ) {
    console.log('Syncing data...', params)
    await service.execute(params)
    config.lastSyncedAt.value = Date.now()
  }

  // ── Interface ─────────────────────────────────────────────────────────
  return { execute, subscribe }
})
