export type Date = [number, number, number]
export type Title = Record<string, string>

export type Track = {
  id: string
  title: Title
  url: string
  location: string
  date: Date,
  references: Array<string[]>
  languages: TrackLanguage[]
  author: string
}

export type TrackLanguage = {
  language: string
  source: 'track' | 'transcript'
  type: 'original' | 'generated' | 'redacted'
}

export type TrackTranscriptBlock = {
  type: string
  start: number
  end: number
  text: string
}

export type TrackTranscriptText = {
  blocks: TrackTranscriptBlock[]
}

export type TrackTranscript = {
  text: TrackTranscriptText
}


export function getLocalizedTitle(
  title: Title,
  locale: string
): string {
  return title[locale] || title[Object.keys(title)[0]] || 'No title'
}