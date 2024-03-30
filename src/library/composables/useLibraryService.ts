import { LibraryService } from '@/library/services'

export function useLibraryService() {
    return new LibraryService()
}
