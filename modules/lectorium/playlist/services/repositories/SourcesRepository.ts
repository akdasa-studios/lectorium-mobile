import { Source } from '@core/models'

export class SourcesRepository {
  public async getAll(): Promise<Source[]> {
    return [
      { id: "123", title: "Бхагавад-гита" },
      { id: "123", title: "Шримад Бхагаватам" },
      { id: "123", title: "Прогулки" },
    ]
  }
}
