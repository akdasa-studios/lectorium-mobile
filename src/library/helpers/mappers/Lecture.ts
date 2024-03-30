import { type LectureViewModel } from "@/library/components"
import { Lecture } from "@/library/services"

export function lectureToViewModel(
  lecture: Lecture
): LectureViewModel {
  return {
    id: lecture.id,
    title: lecture.title,
    description: lecture.description,
  }
}

export function lecturesToViewModel(
  lectures: Lecture[]
): LectureViewModel[] {
  return lectures.map(lectureToViewModel)
}

