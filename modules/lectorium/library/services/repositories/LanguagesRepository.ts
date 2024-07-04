import { Language } from '@core/models'

export class LanguagesRepository {
  public async getAll(): Promise<Language[]> {
    return [
      { code: "en", name: "English" },
      { code: "ru", name: "Русский" },
    ]
  }
}
