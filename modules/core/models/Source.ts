export type Source = {
  id: string
  name: LocalizedSourceNames
}

export type LocalizedSourceNames = { [language: string]: SourceName }

export type SourceName = {
  full: string
  short: string
}


export type Reference = string[]