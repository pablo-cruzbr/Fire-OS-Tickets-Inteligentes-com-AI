"use client";

import { ta } from "@/i18n/active";
import { TbBolt, TbCircleCheck, TbHourglass, TbPlus } from "react-icons/tb";
import { CellTitle, EntityList, optionsFrom } from "@/components/data/EntityList";
import { ButtonLink, StatusBadge } from "@/components/ui";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { EstabilizadoresProps, EstabilizadoresResponse } from "@/lib/getEstabilizadores.type";

export default function EstabilizadoresList({ data }: { data: EstabilizadoresResponse }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<EstabilizadoresProps>
      title={ta({ pt: "Controle de estabilizadores", en: "Stabilizer controls" })}
      breadcrumbs={[{ label: ta({ pt: "Controles", en: "Controls" }) }, { label: ta({ pt: "Estabilizadores", en: "Stabilizers" }) }]}
      items={data.controles ?? []}
      rowKey={(controle) => controle.id}
      stats={[
        { label: ta({ pt: "Total", en: "Total" }), value: data.total ?? 0, tone: "primary", icon: <TbBolt /> },
        { label: ta({ pt: "Aguardando reparo", en: "Awaiting repair" }), value: data.totalAguardandoReparo ?? 0, tone: "warning", icon: <TbHourglass /> },
        { label: ta({ pt: "Finalizado", en: "Finished" }), value: data.totalFinalizado ?? 0, tone: "success", icon: <TbCircleCheck /> },
      ]}
      search={{
        placeholder: ta({ pt: "Buscar patrimônio ou OS da assistência...", en: "Search asset tag or repair work order..." }),
        text: (controle) => [
          controle.estabilizadores?.patrimonio,
          controle.estabilizadores?.name,
          controle.osdaAssistencia,
          controle.idChamado,
        ],
      }}
      filters={[
        {
          label: ta({ pt: "Status", en: "Status" }),
          options: (items) => optionsFrom(items, (controle) => controle.statusEstabilizadores?.name),
          match: (controle, value) => controle.statusEstabilizadores?.name === value,
        },
      ]}
      columns={[
        {
          header: ta({ pt: "Estabilizador", en: "Stabilizer" }),
          cell: (controle) => (
            <CellTitle
              title={controle.estabilizadores?.name ?? "—"}
              subtitle={
                controle.estabilizadores?.patrimonio ? ta({ pt: `Patrimônio ${controle.estabilizadores.patrimonio}`, en: `Asset tag ${controle.estabilizadores.patrimonio}` }) : undefined
              }
            />
          ),
        },
        { header: ta({ pt: "Problema", en: "Problem" }), cell: (controle) => controle.problema || "—" },
        { header: ta({ pt: "OS da assistência", en: "Repair work order" }), cell: (controle) => controle.osdaAssistencia || "—" },
        { header: ta({ pt: "Status", en: "Status" }), cell: (controle) => <StatusBadge status={controle.statusEstabilizadores?.name} /> },
        { header: ta({ pt: "Data", en: "Date" }), cell: (controle) => formatDateTime(controle.created_at), className: "whitespace-nowrap" },
      ]}
      headerActions={
        <ButtonLink
          href="/dashboard/formulariosadd/formularioEstabilizadorAdd"
          variant="surface"
          icon={<TbPlus className="h-4 w-4" />}
        >
          {ta({ pt: "Registrar estabilizador", en: "Add stabilizer" })}
        </ButtonLink>
      }
      add={{ href: "/dashboard/formulariosadd/formularioControledeEstabilizadores", label: ta({ pt: "Novo registro", en: "New record" }) }}
      onOpen={(controle) => openModal("Estabilizadores", controle)}
      emptyMessage={ta({ pt: "Nenhum controle de estabilizador ainda.", en: "No stabilizer controls yet." })}
    />
  );
}
