import { Database } from "@core/persistence"
import Snowball from "snowball"

/**
 * Schema of the Source documents in the Library collection.
 */
type IndexDBSchema = {
  _id: string
  in_title: string[]
}

export type SearchResult = {
  ids: Array<string>
}

export class SearchService {
  // TODO: use database version based on config
  private database = new Database({ name: 'library-index-v0001' })

  /**
   * Searches for Tracks with specified query
   * @param query Query
   * @param language Language
   */
  async search(
    query: string,
    language: string,
  ): Promise<SearchResult> {
    const documentIds: string[][] = []
    const stemmer = new Snowball(language);

    // Get stems of words provided
    const terms: string[] = query
      .toLowerCase()
      .split(" ")
      .filter(x => x !== "")
      .map(x => {
        stemmer.setCurrent(x)
        stemmer.stem()
        return stemmer.getCurrent()
      })

    // Retrieve all documents containing the specified term.
    for (const term of terms) {
      const loadedIndex = await this.database.db.allDocs<IndexDBSchema>({
        startkey: `index::${term}`,
        endkey: `index::${term}\uffff`,
        include_docs: true,
      })

      documentIds.push(loadedIndex.rows
        .flatMap(x => x.doc?.in_title || "")
        .filter(x => x !== "")
      )
    }

    // Get common documents ids for all terms
    let commonIds = documentIds[0];
    for (let i = 1; i < documentIds.length; i++) {
      //const currentSet = new Set<string>(documentIds[i] || [])
      //commonIds = new Set([...commonIds].filter(id => currentSet.has(id)));
      commonIds = commonIds.filter(id => documentIds[i].includes(id));
    }
    return {
      ids: [...new Set(commonIds)]
    }
  }
}