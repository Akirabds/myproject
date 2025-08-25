import { withAuth } from 'next-auth/middleware'

export default withAuth(async function middleware(req) {
  // deixamos a biblioteca checar sessão; para regras mais finas usar token
  return
})

export const config = { matcher: ['/admin/:path*', '/consultor/:path*'] }
