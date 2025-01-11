import type { Catalogo } from '@prisma/client'

// export interface requestCatalogo {
//   id: string,
//   nome: string,
// }
export interface makeeCatalog {
  create(data: Catalogo): Promise<Catalogo>
}
