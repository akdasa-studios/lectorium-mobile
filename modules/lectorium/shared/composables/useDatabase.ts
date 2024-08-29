import { Capacitor } from "@capacitor/core"
import { Database } from "@core/persistence"
import { useConfig } from "@lectorium/shared"

export function useDatabase() {
  const config = useConfig()
  const serverBaseUrl = config.serverBaseUrl.value
  const localAdapter = Capacitor.isNativePlatform() ? 'cordova-sqlite' : undefined

  return {
    local: {
      userData:    new Database({ name: 'data.db', adapter: localAdapter }),
      tracks:      new Database({ name: 'library-tracks-v0001.db', adapter: localAdapter }),
      transcripts: new Database({ name: 'library-transcripts-v0001.db', adapter: localAdapter }),
      dictionary:  new Database({ name: 'library-dictionary-v0001.db', adapter: localAdapter }),
      index:       new Database({ name: 'library-index-v0001.db', adapter: localAdapter })
    },
    remote: {
      tracks:      new Database({ name: serverBaseUrl + '/library-tracks-v0001' }),
      transcripts: new Database({ name: serverBaseUrl + '/library-transcripts-v0001' }),
      dictionary:  new Database({ name: serverBaseUrl + '/library-dictionary-v0001' }),
      index:       new Database({ name: serverBaseUrl + '/library-index-v0001' })
    }
  }
}
