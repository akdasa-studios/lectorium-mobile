import { CollectionsRepository } from '@/library/services'

export function useCollectionsRepository() {
  return new CollectionsRepository()
}
