import { type TrackViewModel } from "@/library/components"
import { Lecture } from "@/library/services"

export function lectureToViewModel(
  lecture: Lecture
): TrackViewModel {
  return {
    id: lecture.id,
    title: lecture.title,
    references: lecture.references,
    location: lecture.location
  }
}

export function lecturesToViewModel(
  lectures: Lecture[]
): TrackViewModel[] {
  return lectures.map(lectureToViewModel)
}

