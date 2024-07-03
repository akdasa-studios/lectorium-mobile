import { Track } from '@core/models'

export class LibraryRepository {
  public async getLecture(id: string): Promise<Track|undefined> {
    return (await this.getLecturesList()).find(x => x.id === id)
  }

  public async getLecturesList(query?: string): Promise<Track[]> {
    // await new Promise(r => setTimeout(r, 1000));

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
      },
      {
        "id": "BG19730709LONDON",
        "title": "Death Is God",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-02-03_London_1973-07-09_Death_Is_God.mp3",
        "location": "London",
        "date": "19730709",
        "references": ["BG 1.2-3"]
      },
      {
        "id": "BG19730710LONDON",
        "title": "Everything, Even...",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-04_London_1973-07-10_Everything_Even--etc.mp3",
        "location": "London",
        "date": "19730710",
        "references": ["BG 1.4"]
      },
      {
        "id": "BG19730711LONDON",
        "title": "Vaisnavism Is Not Cowardism",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-07_London_1973-07-11_Vaisnavism_Is_Not_Cowardism.mp3",
        "location": "London",
        "date": "19730711",
        "references": ["BG 1.7"]
      },
      {
        "id": "BG19730712LONDON",
        "title": "The KC Movement Should Touch...",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-10_London_1973-07-12_The_KC_Movement_Should_Touch--etc.mp3",
        "location": "London",
        "date": "19730712",
        "references": ["BG 1.10"]
      },
      {
        "id": "BG19730713LONDON",
        "title": "Wanting to Be Cheated",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-11-12_London_1973-07-13_Wanting_to_Be_Cheated.mp3",
        "location": "London",
        "date": "19730713",
        "references": ["BG 1.11-12"]
      },
      {
        "id": "BG19730714LONDON",
        "title": "People Want to Be Cheated",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-13_London_1973-07-14_People_Want_to_Be_Cheated.mp3",
        "location": "London",
        "date": "19730714",
        "references": ["BG 1.13"]
      },
      {
        "id": "BG19730715LONDON",
        "title": "Spiritual...",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-15_London_1973-07-15_Spiritual--etc.mp3",
        "location": "London",
        "date": "19730715",
        "references": ["BG 1.15"]
      },
      {
        "id": "BG19730716LONDON",
        "title": "Everybody Wants to Be Served",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-16-19_London_1973-07-16_Everybody_Wants_to_Be_Served.mp3",
        "location": "London",
        "date": "19730716",
        "references": ["BG 1.16-19"]
      },
      {
        "id": "BG19730717LONDON",
        "title": "First, Second, and Third-Class Rascals",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-20_London_1973-07-17_First_Second_and_Third-Class_Rascals.mp3",
        "location": "London",
        "date": "19730717",
        "references": ["BG 1.20"]
      },
      {
        "id": "BG19730718LONDON",
        "title": "Fallible & Infallible Religion",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-21_London_1973-07-18_Fallible_%26_Infallible_Religion.mp3",
        "location": "London",
        "date": "19730718",
        "references": ["BG 1.21"]
      },
      {
        "id": "BG19730719LONDON",
        "title": "How to Enjoy Real Bliss",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-23_London_1973-07-19_How_to_Enjoy_Real_Bliss.mp3",
        "location": "London",
        "date": "19730719",
        "references": ["BG 1.23"]
      },
      {
        "id": "BG19730720LONDON",
        "title": "If You Stay with...",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-24_London_1973-07-20_If_You_Stay_with--etc.mp3",
        "location": "London",
        "date": "19730720",
        "references": ["BG 1.24"]
      },
      {
        "id": "BG19730721LONDON",
        "title": "Society, Friendship, and Love",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-26_London_1973-07-21_Society_Friendship_and_Love.mp3",
        "location": "London",
        "date": "19730721",
        "references": ["BG 1.26"]
      },
      {
        "id": "BG19730723LONDON",
        "title": "Expanded Selfishness",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-30_London_1973-07-23_Expanded_Selfishness.mp3",
        "location": "London",
        "date": "19730723",
        "references": ["BG 1.30"]
      },
      {
        "id": "BG19730724LONDON",
        "title": "Immediate vs. Ultimate Good",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-31_London_1973-07-24_Immediate_vs._Ultimate_Good.mp3",
        "location": "London",
        "date": "19730724",
        "references": ["BG 1.31"]
      },
      {
        "id": "BG19730725LONDON",
        "title": "Shortcut to Spiritual Knowledge",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-32_London_1973-07-25_Shortcut_to_Spiritual_Knowledge.mp3",
        "location": "London",
        "date": "19730725",
        "references": ["BG 1.32"]
      },
      {
        "id": "BG19730726LONDON",
        "title": "Devotee Has All Good Qualities",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-36_London_1973-07-26_Devotee_Has_All_Good_Qualities.mp3",
        "location": "London",
        "date": "19730726",
        "references": ["BG 1.36"]
      },
      {
        "id": "BG19730727LONDON",
        "title": "The Way to Save Society",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-37-39_London_1973-07-27_The_Way_to_Save_Society.mp3",
        "location": "London",
        "date": "19730727",
        "references": ["BG 1.37-39"]
      },
      {
        "id": "BG19730728LONDON",
        "title": "The Psychology of Chastity",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-40_London_1973-07-28_The_Psychology_of_Chastity.mp3",
        "location": "London",
        "date": "19730728",
        "references": ["BG 1.40"]
      },
      {
        "id": "BG19730729LONDON",
        "title": "Relief from Today's Hell",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-41_London_1973-07-29_Relief_from_Today%27s_Hell.mp3",
        "location": "London",
        "date": "19730729",
        "references": ["BG 1.41"]
      },
      {
        "id": "BG19730730LONDON",
        "title": "There Is Only One Remedy",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-43_London_1973-07-30_There_Is_Only_One_Remedy.mp3",
        "location": "London",
        "date": "19730730",
        "references": ["BG 1.43"]
      },
      {
        "id": "BG19730731LONDON",
        "title": "Only Rascal Says Krishna Is Immoral",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-44_London_1973-07-31_Only_Rascal_Says_Krishna_Is_Immoral.mp3",
        "location": "London",
        "date": "19730731",
        "references": ["BG 1.44"]
      },
      {
        "id": "BG19730801LONDON",
        "title": "Krishna's Order Is Final",
        "url": "https://audio.iskcondesiretree.com:443/01_-_Srila_Prabhupada/01_-_Lectures/01_-_English/01_-_Topic_wise/Bhagavad_Gita/Chapter-01/SP_BG_01-45_London_1973-08-01_Krishna%27s_Order_Is_Final.mp3",
        "location": "New York",
        "date": "19730801",
        "references": ["BG 1.45"]
      }
    ].filter(x => !query
      || x.title.toLowerCase().includes(query.toLowerCase())
      || x.references.some(r => r.toLowerCase().includes(query.toLowerCase()))
      || x.location.toLowerCase().includes(query.toLowerCase())
      || x.date.includes(query)
    );
  }
}
