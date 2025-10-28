import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '../../../../src/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { competencia } = req.query;
  const competenciaDate = competencia ? new Date(String(competencia)) : new Date();

  // Se for admin, retorna resumo global
  if ((session.user as any).role === 'ADMIN') {
    // Novos associados no mês
    const novosNoMes = await prisma.associado.count({
      where: {
        criadoEm: {
          gte: new Date(competenciaDate.getFullYear(), competenciaDate.getMonth(), 1),
          lt: new Date(competenciaDate.getFullYear(), competenciaDate.getMonth() + 1, 1),
        },
      },
    });
  // Total de associados (ativos via associacoes) / inativos
  const totalAssociados = await prisma.associado.count();
  const associadosAtivos = await prisma.associacao.findMany({ where: { status: 'ATIVO' }, distinct: ['associadoId'], select: { associadoId: true } as any });
  const totalAtivos = associadosAtivos.length;
  const totalInativos = totalAssociados - totalAtivos;
    // Valores no mês: soma das mensalidades das associacoes criadas neste mês
    const valoresNoMesAgg = await prisma.associacao.aggregate({
      _sum: { valorMensalidade: true },
      where: {
        dataAssociacao: {
          gte: new Date(competenciaDate.getFullYear(), competenciaDate.getMonth(), 1),
          lt: new Date(competenciaDate.getFullYear(), competenciaDate.getMonth() + 1, 1),
        },
      },
    });
    const valoresNoMes = valoresNoMesAgg._sum.valorMensalidade || 0;
    // Base de cálculo e comissão
  // Base de cálculo: soma das mensalidades das associacoes ativas
  const baseCalculoAgg = await prisma.associacao.aggregate({ _sum: { valorMensalidade: true }, where: { status: 'ATIVO' } });
    // Aliquota global (exemplo: 10%)
    const aliquota = 10;
  const valorComissao = (baseCalculoAgg._sum.valorMensalidade || 0) * (aliquota / 100);
    return res.json({
      novosNoMes,
      totalAtivos,
      totalInativos,
      aliquota,
      baseCalculo: baseCalculoAgg._sum.valorMensalidade || 0,
      valorComissao,
      valoresNoMes,
      // associados list removed from dashboard response to keep payload small
      consolidado: false,
      consolidadoEm: null,
      consolidadoPor: null,
      consolidadoPorEmail: null,
    });
  }

  // Consultor comum: resumo só dos seus associados
  const consultorId = (session.user as any).consultorId;
  if (!consultorId) return res.status(403).json({ error: 'Consultor não encontrado' });
  const novosNoMes = await prisma.associado.count({
    where: {
      consultorId,
      criadoEm: {
        gte: new Date(competenciaDate.getFullYear(), competenciaDate.getMonth(), 1),
        lt: new Date(competenciaDate.getFullYear(), competenciaDate.getMonth() + 1, 1),
      },
    },
  });
  const totalAssociados = await prisma.associado.count({ where: { consultorId } });
  const associadosAtivos = await prisma.associacao.findMany({ where: { consultorId, status: 'ATIVO' }, distinct: ['associadoId'], select: { associadoId: true } as any });
  const totalAtivos = associadosAtivos.length;
  const totalInativos = totalAssociados - totalAtivos;
  const baseCalculoAgg = await prisma.associacao.aggregate({ _sum: { valorMensalidade: true }, where: { consultorId, status: 'ATIVO' } });
  const valoresNoMesAgg = await prisma.associacao.aggregate({
    _sum: { valorMensalidade: true },
    where: {
      consultorId,
      dataAssociacao: {
        gte: new Date(competenciaDate.getFullYear(), competenciaDate.getMonth(), 1),
        lt: new Date(competenciaDate.getFullYear(), competenciaDate.getMonth() + 1, 1),
      },
    },
  });
  const valoresNoMes = valoresNoMesAgg._sum.valorMensalidade || 0;
  // Aliquota do consultor (exemplo: 10%)
  const aliquota = 10;
  const valorComissao = (baseCalculoAgg._sum.valorMensalidade || 0) * (aliquota / 100);
  return res.json({
    novosNoMes,
    totalAtivos,
    totalInativos,
    aliquota,
    baseCalculo: baseCalculoAgg._sum.valorMensalidade || 0,
    valorComissao,
    valoresNoMes,
    // associados list removed from dashboard response to keep payload small
    consolidado: false,
    consolidadoEm: null,
    consolidadoPor: null,
    consolidadoPorEmail: null,
  });
}
