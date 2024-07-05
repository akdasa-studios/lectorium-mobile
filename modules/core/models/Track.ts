export interface Track {
  id: string;
  title: string;
  url: string;
  location: string;
  date: string;
  references: string[];
  text: TrackTextParagraph[];
}

export type TrackTextParagraph = {
  blocks: TrackTextBlock[];
}

export type TrackTextBlock = {
  start: number;
  end: number;
  text: string;
}