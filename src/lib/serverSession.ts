import { getServerSession } from 'next-auth'
import { authOptions } from '../../pages/api/auth/[...nextauth]'

export async function getSessionServer(req: any, res: any) {
  return getServerSession(req, res, authOptions as any)
}
