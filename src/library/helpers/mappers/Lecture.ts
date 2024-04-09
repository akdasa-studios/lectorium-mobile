import { PlayingStatus, type TrackViewModel } from "@/library/components"
import { Lecture } from "@/library/services"

export function lectureToViewModel(
  lecture: Lecture
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
  lectures: Lecture[]
): TrackViewModel[] {
  return lectures.map(lectureToViewModel)
}

