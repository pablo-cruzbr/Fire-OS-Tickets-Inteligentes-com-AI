"use client";

import { ta } from "@/i18n/active";
import { TbDevicesPc } from "react-icons/tb";
import { CellTitle, EntityList, optionsFrom } from "@/components/data/EntityList";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { EquipamentoProps } from "@/lib/getEquipamento.type";

export default function EquipamentosList({ data }: { data: EquipamentoProps[] }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<EquipamentoProps>
      title={ta({ pt: "Equipamentos", en: "Equipment" })}
      breadcrumbs={[{ label: ta({ pt: "Controles", en: "Controls" }) }, { label: ta({ pt: "Equipamentos", en: "Equipment" }) }]}
      items={data}
      rowKey={(equipamento) => equipamento.id}
      stats={[{ label: ta({ pt: "Equipamentos cadastrados", en: "Registered equipment" }), value: data.length, tone: "primary", icon: <TbDevicesPc /> }]}
      search={{
        placeholder: ta({ pt: "Buscar patrimônio ou nome...", en: "Search asset tag or name..." }),
        text: (equipamento) => [equipamento.patrimonio, equipamento.name],
      }}
      filters={[
        {
          label: ta({ pt: "Unidade", en: "Unit" }),
          options: (items) => optionsFrom(items, (equipamento) => equipamento.instituicaoUnidade?.name),
          match: (equipamento, value) => equipamento.instituicaoUnidade?.name === value,
        },
      ]}
      columns={[
        {
          header: ta({ pt: "Equipamento", en: "Equipment" }),
          cell: (equipamento) => (
            <CellTitle title={equipamento.name} subtitle={equipamento.tipodeEquipamento?.name} />
          ),
        },
        { header: ta({ pt: "Patrimônio", en: "Asset tag" }), cell: (equipamento) => equipamento.patrimonio ?? "—", className: "whitespace-nowrap" },
        { header: ta({ pt: "Unidade", en: "Unit" }), cell: (equipamento) => equipamento.instituicaoUnidade?.name ?? "—" },
        {
          header: ta({ pt: "Cadastro", en: "Registration" }),
          cell: (equipamento) => formatDateTime(equipamento.created_at),
          className: "whitespace-nowrap",
        },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioMaquinas", label: ta({ pt: "Novo equipamento", en: "New equipment" }) }}
      onOpen={(equipamento) => openModal("equipamento", equipamento)}
      remove={{
        request: (equipamento) => ({ url: `/deleteequipamento/${equipamento.id}` }),
        describe: (equipamento) => `${equipamento.patrimonio} - ${equipamento.name}`,
      }}
      emptyMessage={ta({ pt: "Nenhum equipamento cadastrado ainda.", en: "No equipment yet." })}
    />
  );
}
