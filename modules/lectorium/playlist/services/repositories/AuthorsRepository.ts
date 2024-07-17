import { Author } from '@core/models'

export class AuthorsRepository {
  public async getAll(): Promise<Author[]> {
    return [
      { id: "123", name: "Шрила Прабхупада" },
      { id: "123", name: "Бхакти Чайтанья Свами" },
      { id: "123", name: "Ватсала дас" },
    ]
  }
}
