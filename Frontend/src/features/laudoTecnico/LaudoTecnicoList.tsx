"use client";

import { ta } from "@/i18n/active";
import { TbCalendarMonth, TbFileCertificate } from "react-icons/tb";
import { CellTitle, EntityList } from "@/components/data/EntityList";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDate, formatDateTime } from "@/lib/format";
import type { LaudoTecnicoProps } from "@/lib/getLaudoTecnico.type";

function isThisMonth(value?: string) {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export default function LaudoTecnicoList({ items }: { items: LaudoTecnicoProps[] }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<LaudoTecnicoProps>
      title={ta({ pt: "Laudo técnico", en: "Technical report" })}
      breadcrumbs={[{ label: ta({ pt: "Controles", en: "Controls" }) }, { label: ta({ pt: "Laudo técnico", en: "Technical report" }) }]}
      items={items}
      rowKey={(laudo) => laudo.id}
      stats={[
        { label: ta({ pt: "Total de laudos", en: "Total reports" }), value: items.length, tone: "primary", icon: <TbFileCertificate /> },
        {
          label: ta({ pt: "Criados neste mês", en: "Created this month" }),
          value: items.filter((laudo) => isThisMonth(laudo.created_at)).length,
          tone: "secondary",
          icon: <TbCalendarMonth />,
        },
      ]}
      search={{
        placeholder: ta({ pt: "Buscar patrimônio ou OS...", en: "Search asset tag or work order..." }),
        text: (laudo) => [laudo.equipamento?.patrimonio, laudo.equipamento?.name, laudo.osLab],
      }}
      columns={[
        {
          header: ta({ pt: "OS do laboratório", en: "Lab work order" }),
          cell: (laudo) => <CellTitle title={laudo.osLab || "—"} subtitle={laudo.descricaodoProblema} />,
        },
        {
          header: ta({ pt: "Equipamento", en: "Equipment" }),
          cell: (laudo) => (
            <CellTitle
              title={laudo.equipamento?.name ?? "—"}
              subtitle={laudo.equipamento?.patrimonio ? ta({ pt: `Patrimônio ${laudo.equipamento.patrimonio}`, en: `Asset tag ${laudo.equipamento.patrimonio}` }) : undefined}
            />
          ),
        },
        { header: ta({ pt: "Instituição/unidade", en: "Institution/unit" }), cell: (laudo) => laudo.instituicaoUnidade?.name ?? "—" },
        { header: ta({ pt: "Data do laudo", en: "Report date" }), cell: (laudo) => formatDate(laudo.mesAno), className: "whitespace-nowrap" },
        { header: ta({ pt: "Criado em", en: "Created on" }), cell: (laudo) => formatDateTime(laudo.created_at), className: "whitespace-nowrap" },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioLaudoTecnico", label: ta({ pt: "Novo registro", en: "New record" }) }}
      onOpen={(laudo) => openModal("laudotecnico", laudo)}
      remove={{
        request: (laudo) => ({ url: `/deletecontroledelaudotecnico/${laudo.id}` }),
        describe: (laudo) => (laudo.osLab ? `Laudo ${laudo.osLab}` : "este laudo"),
      }}
      emptyMessage={ta({ pt: "Nenhum laudo técnico ainda.", en: "No technical reports yet." })}
    />
  );
}
