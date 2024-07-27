export type Track = {
  id: string
  title: string
  url: string
  location: string
  date: string
  references: Array<string[]>
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
