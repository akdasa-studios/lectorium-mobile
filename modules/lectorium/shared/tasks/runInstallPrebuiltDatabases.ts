import { Capacitor } from "@capacitor/core"
import { Directory, Filesystem } from "@capacitor/filesystem"
import { blobToBase64 } from "@core/utils"
import { useConfig, useLogger } from "@lectorium/shared"

const DATABASE_FILES = [
  'library-tracks-v0001.db',
  'library-index-v0001.db',
  'library-dictionary-v0001.db',
]

export async function runInstallPrebuiltDatabases() {
  // ── Dependencies ────────────────────────────────────────────────────
  const config = useConfig()
  const log = useLogger({ name: "task::installPrebuiltDatabases" })

  // Skip if prebuilt databases are not installed or not on native platform
  if (!Capacitor.isNativePlatform()) { return }
  if (config.prebuiltDbInstalled.value) { return }

  // ── Install ─────────────────────────────────────────────────────────
  try {
    await Filesystem.mkdir({
      path: '../databases',
      directory: Directory.Data,
    });
    log.info('Directory created');

    for (const file of DATABASE_FILES) {
      log.info(`Downloading ${file}...`)
      const res  = await fetch(`https://localhost/${file}`)
      const blob = await res.blob()

      log.info(`Writing ${file}...`)
      await Filesystem.writeFile({
        directory: Directory.Data,
        path: `../databases/${file}`,
        data: await blobToBase64(blob),
      })
    }
    log.info('Prebuilt databases installed');
  } catch (error) {
    log.error('Error while installing databases', JSON.stringify(error));
  } finally {
    config.prebuiltDbInstalled.value = true
  }
}
