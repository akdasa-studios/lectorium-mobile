import {
  SourcesService, LocationsService, SearchService, CollectionsService,
  AuthorsService, LanguagesService, LibraryService,
  TracksService
} from '@lectorium/shared'
import { useDatabase } from '@lectorium/shared'

export function useLibrary() {
  const database = useDatabase()
  return {
    sources: new SourcesService(database.local.dictionary),
    locations: new LocationsService(database.local.dictionary),
    collections: new CollectionsService(database.local.userData),
    authors: new AuthorsService(database.local.dictionary),
    tracks: new TracksService(database.local.tracks),
    transcripts: new LibraryService(database.local.transcripts),
    languages: new LanguagesService(),
    search: new SearchService(database.local.index)
  }
}
