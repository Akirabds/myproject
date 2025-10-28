
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') })
const { prisma } = require('../src/lib/prisma')
const bcrypt = require('bcryptjs')

async function main() {
  // Ordem correta para truncar devido a FKs
  await prisma.pagamento.deleteMany({});
  await prisma.resumoMensalComissao.deleteMany({});
  await prisma.associacao.deleteMany({});
  await prisma.associado.deleteMany({});
  await prisma.consultor.deleteMany({});
  await prisma.usuario.deleteMany({});

  // Cria apenas o usuário admin
  const senha = 'admin123';
  const senhaHash = await bcrypt.hash(senha, 10);
  await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@admin.com',
      senhaHash,
      role: 'ADMIN',
    },
  });
  console.log('Banco zerado. Usuário admin@admin.com/senha: admin123 criado.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect() })
