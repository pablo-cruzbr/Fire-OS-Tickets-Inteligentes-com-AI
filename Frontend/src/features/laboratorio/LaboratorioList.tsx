"use client";

import { ta } from "@/i18n/active";
import { TbArrowBackUp, TbFileDescription, TbFlask, TbTool } from "react-icons/tb";
import { CellTitle, EntityList, optionsFrom } from "@/components/data/EntityList";
import { StatusBadge } from "@/components/ui";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { LaboratorioProps, LaboratorioResponse } from "@/lib/getLaboratorio.type";

export default function LaboratorioList({ data }: { data: LaboratorioResponse }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<LaboratorioProps>
      title={ta({ pt: "Controle de laboratório", en: "Lab control" })}
      breadcrumbs={[{ label: ta({ pt: "Controles", en: "Controls" }) }, { label: ta({ pt: "Laboratório", en: "Repair lab" }) }]}
      items={data.controles ?? []}
      rowKey={(laboratorio) => laboratorio.id}
      stats={[
        { label: ta({ pt: "Total", en: "Total" }), value: data.total ?? 0, tone: "primary", icon: <TbFlask /> },
        { label: ta({ pt: "Aguardando conserto", en: "Awaiting repair" }), value: data.totalAguardandoConserto ?? 0, tone: "warning", icon: <TbTool /> },
        {
          label: ta({ pt: "Aguardando devolução", en: "Awaiting return" }),
          value: data.totalAguardandoDevolucao ?? 0,
          tone: "secondary",
          icon: <TbArrowBackUp />,
        },
        {
          label: ta({ pt: "Aguardando OS de laboratório", en: "Awaiting lab work order" }),
          value: data.totalAguardandoOSdeLaboratorio ?? 0,
          tone: "info",
          icon: <TbFileDescription />,
        },
      ]}
      search={{
        placeholder: ta({ pt: "Buscar patrimônio, OS de abertura...", en: "Search asset tag, opening work order..." }),
        text: (laboratorio) => [
          laboratorio.equipamento?.patrimonio,
          laboratorio.osDeAbertura,
          laboratorio.osDeDevolucao,
          laboratorio.nomedoEquipamento,
        ],
      }}
      filters={[
        {
          label: ta({ pt: "Status", en: "Status" }),
          options: (items) => optionsFrom(items, (laboratorio) => laboratorio.statusControledeLaboratorio?.name),
          match: (laboratorio, value) => laboratorio.statusControledeLaboratorio?.name === value,
        },
      ]}
      columns={[
        {
          header: ta({ pt: "OS de abertura", en: "Opening work order" }),
          cell: (laboratorio) => (
            <CellTitle title={laboratorio.osDeAbertura || "—"} subtitle={laboratorio.nomedoEquipamento} />
          ),
        },
        { header: ta({ pt: "Patrimônio", en: "Asset tag" }), cell: (laboratorio) => laboratorio.equipamento?.patrimonio ?? "—" },
        { header: ta({ pt: "Instituição/unidade", en: "Institution/unit" }), cell: (laboratorio) => laboratorio.instituicaoUnidade?.name ?? "—" },
        {
          header: ta({ pt: "Status", en: "Status" }),
          cell: (laboratorio) => <StatusBadge status={laboratorio.statusControledeLaboratorio?.name} />,
        },
        { header: ta({ pt: "Data", en: "Date" }), cell: (laboratorio) => formatDateTime(laboratorio.created_at), className: "whitespace-nowrap" },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioLaboratorio", label: ta({ pt: "Novo registro", en: "New record" }) }}
      onOpen={(laboratorio) => openModal("laboratorio", laboratorio)}
      remove={{
        request: (laboratorio) => ({
          url: `/deletecontroledelaboratorio/${laboratorio.id}`,
          params: { controle_id: laboratorio.id },
        }),
        describe: (laboratorio) => laboratorio.osDeAbertura || laboratorio.nomedoEquipamento,
      }}
      emptyMessage={ta({ pt: "Nenhum registro de laboratório ainda.", en: "No lab records yet." })}
    />
  );
}
