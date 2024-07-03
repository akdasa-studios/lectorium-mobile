import { AuthorsRepository } from '@lectorium/library/services'

export function useAuthorsRepository() {
  return new AuthorsRepository()
}
