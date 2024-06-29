import { LibraryRepository } from '@/library/services'

export function useLibraryRepository() {
  return new LibraryRepository()
}
