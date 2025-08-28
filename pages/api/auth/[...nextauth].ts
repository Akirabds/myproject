import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { prisma } from '../../../src/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email@exemplo.com' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Preencha e-mail e senha');
        }
        const user = await prisma.usuario.findUnique({ where: { email: credentials.email } });
        if (!user) {
          throw new Error('Usuário não cadastrado');
        }
        const valid = await bcrypt.compare(credentials.password, user.senhaHash);
        if (!valid) {
          throw new Error('Senha incorreta');
        }
        return {
          id: user.id,
          name: user.nome,
          email: user.email,
          role: user.role,
          consultorId: user.role === 'CONSULTOR' ? (await prisma.consultor.findFirst({ where: { usuarioId: user.id } }))?.id : undefined,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role;
        token.consultorId = user.consultorId;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.consultorId = token.consultorId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

export default NextAuth(authOptions);
