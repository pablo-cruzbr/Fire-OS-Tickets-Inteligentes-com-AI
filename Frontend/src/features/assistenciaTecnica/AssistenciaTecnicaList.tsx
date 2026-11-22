"use client";

import { ta } from "@/i18n/active";
import { TbCircleCheck, TbHourglass, TbTool } from "react-icons/tb";
import { CellTitle, EntityList, optionsFrom } from "@/components/data/EntityList";
import { StatusBadge } from "@/components/ui";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { AssistenciaTecnicaProps, AssistenciaTecnicaResponse } from "@/lib/getAssistenciaTecnica.type";

export default function AssistenciaTecnicaList({ data }: { data: AssistenciaTecnicaResponse }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<AssistenciaTecnicaProps>
      title={ta({ pt: "Assistência técnica", en: "Repair service" })}
      breadcrumbs={[{ label: ta({ pt: "Controles", en: "Controls" }) }, { label: ta({ pt: "Assistência técnica", en: "Repair service" }) }]}
      items={data.controles ?? []}
      rowKey={(assistencia) => assistencia.id}
      stats={[
        { label: ta({ pt: "Total", en: "Total" }), value: data.total ?? 0, tone: "primary", icon: <TbTool /> },
        { label: ta({ pt: "Aguardando reparo", en: "Awaiting repair" }), value: data.totalAguardandoReparo ?? 0, tone: "warning", icon: <TbHourglass /> },
        { label: ta({ pt: "Reparo finalizado", en: "Repair finished" }), value: data.totalFinalizado ?? 0, tone: "success", icon: <TbCircleCheck /> },
      ]}
      search={{
        placeholder: ta({ pt: "Buscar patrimônio, OS da assistência...", en: "Search asset tag, repair work order..." }),
        text: (assistencia) => [
          assistencia.equipamento?.patrimonio,
          assistencia.equipamento?.name,
          assistencia.osDaAssistencia,
          assistencia.idChamado,
          assistencia.name,
        ],
      }}
      filters={[
        {
          label: ta({ pt: "Status", en: "Status" }),
          options: (items) => optionsFrom(items, (assistencia) => assistencia.statusReparo?.name),
          match: (assistencia, value) => assistencia.statusReparo?.name === value,
        },
      ]}
      columns={[
        {
          header: ta({ pt: "Equipamento", en: "Equipment" }),
          cell: (assistencia) => (
            <CellTitle
              title={assistencia.equipamento?.name ?? "—"}
              subtitle={assistencia.equipamento?.patrimonio ? ta({ pt: `Patrimônio ${assistencia.equipamento.patrimonio}`, en: `Asset tag ${assistencia.equipamento.patrimonio}` }) : undefined}
            />
          ),
        },
        { header: ta({ pt: "OS da assistência", en: "Repair work order" }), cell: (assistencia) => assistencia.osDaAssistencia || "—" },
        { header: ta({ pt: "Instituição/unidade", en: "Institution/unit" }), cell: (assistencia) => assistencia.instituicaoUnidade?.name ?? "—" },
        { header: ta({ pt: "Status", en: "Status" }), cell: (assistencia) => <StatusBadge status={assistencia.statusReparo?.name} /> },
        { header: ta({ pt: "Data", en: "Date" }), cell: (assistencia) => formatDateTime(assistencia.created_at), className: "whitespace-nowrap" },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioAssistenciaTecnica", label: ta({ pt: "Novo registro", en: "New record" }) }}
      onOpen={(assistencia) => openModal("assistencia", assistencia)}
      remove={{
        request: (assistencia) => ({
          url: `/controledeassistenciatecnica/${assistencia.id}`,
          params: { controle_id: assistencia.id },
        }),
        describe: (assistencia) => assistencia.equipamento?.name ?? assistencia.name,
      }}
      emptyMessage={ta({ pt: "Nenhum registro de assistência técnica ainda.", en: "No repair service records yet." })}
    />
  );
}
