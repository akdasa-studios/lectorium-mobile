
export interface Lecture {
  id: string;
  title: string;
  description: string;
}

export class LibraryService {
  public getLecturesList(): Lecture[] {
    return [
      { id: "1", title: 'Lecture 1', description: 'Description 1' },
      { id: "2", title: 'Lecture 2', description: 'Description 2' },
      { id: "3", title: 'Lecture 3', description: 'Description 3' },
    ];
  }
}
