import { Track } from '@core/models'
import { PlayingStatus, type TrackViewModel } from '@lectorium/library/components'

export function lectureToViewModel(
  lecture: Track
): TrackViewModel {
  return {
    id: lecture.id,
    title: lecture.title,
    references: lecture.references,
    location: lecture.location,
    playingStatus: PlayingStatus.None,
  }
}

export function lecturesToViewModel(
  lectures: Track[]
): TrackViewModel[] {
  return lectures.map(lectureToViewModel)
}

