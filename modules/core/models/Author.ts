export type AuthorName = {
  full: string
  short: string
}

export type LocalizedAuthorName = Record<string, AuthorName>

export type Author = {
  _id: string
  name: LocalizedAuthorName
}