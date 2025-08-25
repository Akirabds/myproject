const { PrismaClient } = require('@prisma/client')
;(async () => {
  const p = new PrismaClient()
  try {
    console.log('Usuarios:', await p.usuario.count())
    console.log('Consultores:', await p.consultor.count())
    console.log('Associados:', await p.associado.count())
    console.log('Associacoes:', await p.associacao.count())
    console.log('Resumos:', await p.resumoMensalComissao.count())
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await p.$disconnect()
  }
})()
