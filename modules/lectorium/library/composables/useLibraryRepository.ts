import { LibraryRepository } from '@lectorium/library/services'

export function useLibraryRepository() {
  return new LibraryRepository()
}
