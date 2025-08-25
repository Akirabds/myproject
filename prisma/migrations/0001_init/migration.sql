-- Migration SQL generated from steps.sql

-- fn_aliquota
create or replace function fn_aliquota(novos int)
returns numeric as $$
select case
  when novos >= 10 then 10
  when novos >= 7  then 7
  when novos >= 5  then 5
  else 0
end;
$$ language sql immutable;

-- view: associados ativos por mes (simplificada)
create or replace view view_associados_ativos_por_mes as
select
  a."consultorId" as consultor_id,
  date_trunc('month', a."dataAssociacao") as competencia,
  count(*) filter (where a.status = 'ATIVO') as total_ativos,
  sum(a."valorMensalidade") filter (where a.status = 'ATIVO') as soma_mensalidades
from "Associacao" a
group by a."consultorId", date_trunc('month', a."dataAssociacao");
