"use client";

import { ta } from "@/i18n/active";
import { TbArchive, TbCircleCheck, TbDeviceDesktop, TbPackageExport, TbPlugConnected, TbTool } from "react-icons/tb";
import { CellTitle, EntityList, optionsFrom } from "@/components/data/EntityList";
import { StatusBadge } from "@/components/ui";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDate, formatDateTime } from "@/lib/format";
import type { MaquinasPendentesLabPropsResponse, MaquinasPendentesOroProps } from "@/lib/getMaquinasPendentesOro.type";

export default function MaquinasPendentesOroList({ data }: { data: MaquinasPendentesLabPropsResponse }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<MaquinasPendentesOroProps>
      title={ta({ pt: "Máquinas pendentes ORO", en: "Pending ORO machines" })}
      breadcrumbs={[{ label: ta({ pt: "Controles", en: "Controls" }) }, { label: ta({ pt: "Pendentes ORO", en: "Pending ORO" }) }]}
      items={data.controles ?? []}
      rowKey={(maquina) => maquina.id}
      stats={[
        { label: ta({ pt: "Total", en: "Total" }), value: data.total ?? 0, tone: "primary", icon: <TbDeviceDesktop /> },
        { label: ta({ pt: "Disponível", en: "Available" }), value: data.totalDisponivel ?? 0, tone: "success", icon: <TbCircleCheck /> },
        { label: ta({ pt: "Instalada", en: "Installed" }), value: data.totalInstalada ?? 0, tone: "info", icon: <TbPlugConnected /> },
        { label: ta({ pt: "Em manutenção", en: "Under maintenance" }), value: data.totalEmManutencao ?? 0, tone: "secondary", icon: <TbTool /> },
        {
          label: ta({ pt: "Aguardando retirada", en: "Awaiting pickup" }),
          value: data.totalAguardandoRetirada ?? 0,
          tone: "warning",
          icon: <TbPackageExport />,
        },
        { label: ta({ pt: "Descartada", en: "Discarded" }), value: data.totalDescartada ?? 0, tone: "error", icon: <TbArchive /> },
      ]}
      search={{
        placeholder: ta({ pt: "Buscar patrimônio ou OS...", en: "Search asset tag or work order..." }),
        text: (maquina) => [maquina.equipamento?.patrimonio, maquina.osInstalacao, maquina.osRetirada],
      }}
      filters={[
        {
          label: ta({ pt: "Status", en: "Status" }),
          options: (items) => optionsFrom(items, (maquina) => maquina.statusMaquinasPendentesOro?.name),
          match: (maquina, value) => maquina.statusMaquinasPendentesOro?.name === value,
        },
      ]}
      columns={[
        {
          header: ta({ pt: "Máquina", en: "Machine" }),
          cell: (maquina) => (
            <CellTitle title={maquina.equipamento?.name ?? "—"} subtitle={maquina.equipamento?.patrimonio} />
          ),
        },
        { header: ta({ pt: "Unidade", en: "Unit" }), cell: (maquina) => maquina.instituicaoUnidade?.name ?? "—" },
        {
          header: ta({ pt: "Instalação", en: "Installation" }),
          cell: (maquina) => formatDate(maquina.datadaInstalacao),
          className: "whitespace-nowrap",
        },
        { header: ta({ pt: "Status", en: "Status" }), cell: (maquina) => <StatusBadge status={maquina.statusMaquinasPendentesOro?.name} /> },
        { header: ta({ pt: "Data", en: "Date" }), cell: (maquina) => formatDateTime(maquina.created_at), className: "whitespace-nowrap" },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioPendentesOro", label: ta({ pt: "Novo registro", en: "New record" }) }}
      onOpen={(maquina) => openModal("maquinasPendentesOro", maquina)}
      remove={{
        request: (maquina) => ({
          url: `/deletecontroledemaquinaspendentesoro/${maquina.id}`,
          params: { controle_id: maquina.id },
        }),
        describe: (maquina) => maquina.equipamento?.patrimonio ?? maquina.osInstalacao,
      }}
      emptyMessage={ta({ pt: "Nenhuma máquina pendente ORO.", en: "No pending ORO machines." })}
    />
  );
}
