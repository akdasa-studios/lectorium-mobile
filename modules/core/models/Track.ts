export type Track = {
  id: string
  title: string
  url: string
  location: string
  date: string
  references: Array<string[]>
  languages: Language[]
}

export type Language = {
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
