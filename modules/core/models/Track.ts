export interface Track {
  id: string;
  title: string;
  url: string;
  location: string;
  date: string;
  references: string[];
  text: TrackText[];
}

export type TrackText = {
  start: number;
  end: number;
  text: string;
}
