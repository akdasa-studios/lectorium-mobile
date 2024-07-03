import { AuthorsRepository } from '@/library/services'

export function useAuthorsRepository() {
  return new AuthorsRepository()
}
