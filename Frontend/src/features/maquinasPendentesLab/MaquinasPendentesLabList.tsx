"use client";

import { ta } from "@/i18n/active";
import { TbDeviceDesktopCog, TbHourglass, TbReplace } from "react-icons/tb";
import { CellTitle, EntityList, optionsFrom } from "@/components/data/EntityList";
import { StatusBadge } from "@/components/ui";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { MaquinasPendentesLabProps, MaquinasPendentesLabResponse } from "@/lib/getMaquinasPendentesLab.type";

export default function MaquinasPendentesLabList({ data }: { data: MaquinasPendentesLabResponse }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<MaquinasPendentesLabProps>
      title={ta({ pt: "Máquinas pendentes laboratório", en: "Machines pending in lab" })}
      breadcrumbs={[{ label: ta({ pt: "Controles", en: "Controls" }) }, { label: ta({ pt: "Pendentes laboratório", en: "Pending in lab" }) }]}
      items={data.controles ?? []}
      rowKey={(maquina) => maquina.id}
      stats={[
        { label: ta({ pt: "Total", en: "Total" }), value: data.total ?? 0, tone: "primary", icon: <TbDeviceDesktopCog /> },
        { label: ta({ pt: "Pendente ORO", en: "Pending ORO" }), value: data.totalPendenteOro ?? 0, tone: "warning", icon: <TbHourglass /> },
        { label: ta({ pt: "Substituta", en: "Replacement" }), value: data.totalSubstituta ?? 0, tone: "secondary", icon: <TbReplace /> },
      ]}
      search={{
        placeholder: ta({ pt: "Buscar patrimônio ou OS...", en: "Search asset tag or work order..." }),
        text: (maquina) => [maquina.equipamento?.patrimonio, maquina.idDaOs],
      }}
      filters={[
        {
          label: ta({ pt: "Status", en: "Status" }),
          options: (items) => optionsFrom(items, (maquina) => maquina.statusMaquinasPendentesLab?.name),
          match: (maquina, value) => maquina.statusMaquinasPendentesLab?.name === value,
        },
      ]}
      columns={[
        {
          header: ta({ pt: "Máquina", en: "Machine" }),
          cell: (maquina) => (
            <CellTitle title={maquina.equipamento?.name ?? "—"} subtitle={maquina.equipamento?.patrimonio} />
          ),
        },
        { header: ta({ pt: "OS", en: "WO" }), cell: (maquina) => maquina.idDaOs ?? "—", className: "whitespace-nowrap" },
        { header: ta({ pt: "SSD", en: "SSD" }), cell: (maquina) => maquina.ssd ?? "—" },
        { header: ta({ pt: "Status", en: "Status" }), cell: (maquina) => <StatusBadge status={maquina.statusMaquinasPendentesLab?.name} /> },
        { header: ta({ pt: "Data", en: "Date" }), cell: (maquina) => formatDateTime(maquina.created_at), className: "whitespace-nowrap" },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioPendentesLab", label: ta({ pt: "Novo registro", en: "New record" }) }}
      onOpen={(maquina) => openModal("maquinasPendentesLab", maquina)}
      remove={{
        request: (maquina) => ({ url: `/deletecontroledemaquinaspendenteslab/${maquina.id}` }),
        describe: (maquina) => maquina.equipamento?.patrimonio ?? maquina.numeroDeSerie,
      }}
      emptyMessage={ta({ pt: "Nenhuma máquina pendente no laboratório.", en: "No machines pending in the lab." })}
    />
  );
}
