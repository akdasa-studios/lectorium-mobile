export type Location = {
  id: string
  name: LocationNames
}

export type LocationName = string

export type LocationNames = { [language: string]: LocationName }
