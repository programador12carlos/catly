import type { Fornecedor } from '@prisma/client'

export interface makeFornecedor {
  actualizar(data: Fornecedor): Promise<Fornecedor>
  procurarFornecedorId(id: string): Promise<Fornecedor | null>
  procurarFornecedorEmail(email: string): Promise<Fornecedor | null>
}
