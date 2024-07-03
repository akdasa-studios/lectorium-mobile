import { CollectionsRepository } from '@lectorium/library/services'

export function useCollectionsRepository() {
  return new CollectionsRepository()
}
