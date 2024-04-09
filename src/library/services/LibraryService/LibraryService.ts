
export interface Lecture {
  id: string;
  title: string;
  url: string;
  location: string;
  date: string;
  references: string[];
}

export class LibraryService {
  public async getLecture(id: string): Promise<Lecture|undefined> {
    return (await this.getLecturesList()).find(x => x.id === id)
  }

  public async getLecturesList(): Promise<Lecture[]> {
    await new Promise(r => setTimeout(r, 1000));

    return [
      {
        id: "BG19730707LONDON",
        title: "The Material World Means",
        url: "https://audio.iskcondesiretree.com/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-01_London_1973-07-07_The_Material_World_Means--etc.mp3",
        location: "London",
        date: "19730707",
        references: ["BG 1.1"]
      },
      {
        id: "BG19730722LONDON",
        title: "The art of preaching",
        url: "https://audio.iskcondesiretree.com/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-28_London_1973-07-22_The_Art_of_Preaching.mp3",
        location: "London",
        date: "19730722",
        references: ["BG 1.28"]
      }
    ]
  }
}
