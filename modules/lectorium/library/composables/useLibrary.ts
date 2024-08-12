import {
  SourcesService, LocationsService, SearchService, CollectionsService,
  AuthorsService, LanguagesService, LibraryService
} from '@lectorium/shared'

export function useLibrary() {
  return {
    sources: new SourcesService(),
    locations: new LocationsService(),
    collections: new CollectionsService(),
    authors: new AuthorsService(),
    tracks: new LibraryService(),
    languages: new LanguagesService(),
    search: new SearchService()
  }
}
