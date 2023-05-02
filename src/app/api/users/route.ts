import { isEmail } from '@/helpers/is-email'
import { HTTPResponse } from '@/helpers/response'
import { invalidateCache, withCache } from '@/lib/cache'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const users = await withCache(() => prisma.user.findMany(), 'users')

  return HTTPResponse.success({
    data: users,
  })
}

export async function POST(request: Request) {
  const { name, email } = await request.json()

  // Verificar se o nome e email tem no body
  if (!name || !email) {
    return HTTPResponse.error({
      statusCode: 400,
      message: 'Por favor, preencha todos os campos.',
    })
  }

  // Verificar se o e-mail é válido
  if (!isEmail(email)) {
    return HTTPResponse.error({
      statusCode: 400,
      message: 'Por favor, informe um endereço de e-mail válido.',
    })
  }

  // Verificar se o e-mail já está cadastrado
  const userExists = await prisma.user.findUnique({ where: { email } })
  if (userExists) {
    return HTTPResponse.error({
      statusCode: 400,
      message: 'Este endereço de e-mail já está cadastrado.',
    })
  }

  const user = await prisma.user.create({ data: { name, email } })

  await invalidateCache('users')

  return HTTPResponse.success({ data: user, statusCode: 201 })
}
