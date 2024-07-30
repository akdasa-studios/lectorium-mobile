import {
  AuthorsRepository, CollectionsRepository, LanguagesRepository,
  LibraryRepository
} from '@lectorium/playlist/services'
import { SourcesService, LocationsService } from '@lectorium/shared'

export function useLibrary() {
  return {
    sources: new SourcesService(),
    locations: new LocationsService(),
    collections: new CollectionsRepository(),
    authors: new AuthorsRepository(),
    tracks: new LibraryRepository(),
    languages: new LanguagesRepository(),
  }
}
