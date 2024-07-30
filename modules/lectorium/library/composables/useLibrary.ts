import {
  AuthorsRepository, CollectionsRepository, LanguagesRepository,
  LibraryRepository
} from '@lectorium/playlist/services'
import { SourcesService } from '@lectorium/shared'

export function useLibrary() {
  return {
    sources: new SourcesService(),
    collections: new CollectionsRepository(),
    authors: new AuthorsRepository(),
    tracks: new LibraryRepository(),
    languages: new LanguagesRepository(),
  }
}
