export interface Collection {
  id: string;
  title: string;
  cover: string;
}

export class CollectionsRepository {
  public async getAll(): Promise<Collection[]> {
    return [
      { id: "123", title: "Бхагавад-гита", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShfakbIGHgEsHovFta0QQ32bgBJ2TyFT6ivQ&s" },
      { id: "123", title: "Шримад Бхагаватам", cover: "https://m.media-amazon.com/images/I/8107kx7HAAL._AC_UF1000,1000_QL80_.jpg" },
      { id: "123", title: "Прогулки", cover: "https://iskconboston.org/sites/default/files/field/image/srila-prabhupada-smile.jpg" },
      { id: "123", title: "Ватсала дас", cover: "https://treningi4you.com/upload/iblock/d61/d611d4bb9bf8b6e34d14ccbffe6217df.jpg" },
    ]
  }

  public async getById(id: string): Promise<Collection> {
    return { id: "123", title: "Бхагавад-гита", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShfakbIGHgEsHovFta0QQ32bgBJ2TyFT6ivQ&s" }
  }
}
