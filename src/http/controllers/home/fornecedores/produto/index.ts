import { factoriesProdutos } from '@/use-case/factories/factories-produto'
import { exibir } from '@/use-case/utils/exibir'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { FactoriesFornecedor } from '@/use-case/factories/factories-fornecedor'

export async function RegisterProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const DISPONIVEL = 'DISPONIVEL'
  const INDISPONIVEL = 'INDISPONIVEL'

  const shemaProduct = z.object({
    nome: z.string().min(1, 'Nome do produto é obrigatório'),
    preco: z.number().positive('Preço deve ser maior que 0'),
    quantidade: z.number().int('Quantidade deve ser um número inteiro'),
    disponivel: z.enum([DISPONIVEL, INDISPONIVEL], {
      errorMap: () => ({
        message: 'Disponibilidade deve ser DISPONIVEL ou INDISPONIVEL',
      }),
    }),
  })

  try {
    const usuario =  request.user
    const userId = usuario.sub
    const idUserEmail = usuario.email

    if (!userId || !idUserEmail) {
      throw new Error('Token JWT inválido ou informações do usuário ausentes')
    }

    exibir.info(`Usuário autenticado: ${userId}`)

    const data = shemaProduct.parse(request.body)
    exibir.info('Dados validados com sucesso')

    const fornecedorData =
      await FactoriesFornecedor().findFornecedorEmail(idUserEmail)

    if (!fornecedorData || !fornecedorData.fornecedor) {
      throw new Error('Fornecedor não encontrado para o email fornecido')
    }

    const fornecedorId = fornecedorData.fornecedor.id
    exibir.info(`Fornecedor encontrado: ${fornecedorId}`)

    const produto = await factoriesProdutos().createProduto({
      quantidade: data.quantidade,
      preco: data.preco,
      nome: data.nome,
      disponivel: data.disponivel,
      fornecedorId: fornecedorId,
      catalogoId: 

    })

    exibir.info(`Produto criado com sucesso: ${produto.produto.nome}`)
    reply.status(201).send({ message: 'Produto criado com sucesso' })
  } catch (err: any) {
    const errorMessage =
      err instanceof z.ZodError
        ? 'Erro de validação: ' + err.errors.map(e => e.message).join(', ')
        : err.message || 'Erro desconhecido'

    exibir.fatal(`Erro ao criar produto: ${errorMessage}`)
    reply.status(400).send({
      message: 'Erro no cadastro do produto',
      details: errorMessage,
    })
  }
}

