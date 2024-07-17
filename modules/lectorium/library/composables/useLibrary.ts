import {
  AuthorsRepository, CollectionsRepository, LanguagesRepository,
  LibraryRepository, SourcesRepository
} from '@lectorium/playlist/services'

export function useLibrary() {
  return {
    sources: new SourcesRepository(),
    collections: new CollectionsRepository(),
    authors: new AuthorsRepository(),
    tracks: new LibraryRepository(),
    languages: new LanguagesRepository(),
  }
}
