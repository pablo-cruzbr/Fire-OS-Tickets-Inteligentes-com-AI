"use client";

import { ta } from "@/i18n/active";
import { TbTool } from "react-icons/tb";
import { CellTitle, EntityList } from "@/components/data/EntityList";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { TecnicoPropsResponse, TecnicosProps } from "@/lib/getTecnicos.type";

export default function TecnicosList({ data }: { data: TecnicoPropsResponse }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<TecnicosProps>
      title={ta({ pt: "Técnicos", en: "Technicians" })}
      breadcrumbs={[{ label: ta({ pt: "Administração", en: "Administration" }) }, { label: ta({ pt: "Técnicos", en: "Technicians" }) }]}
      items={data.controles ?? []}
      rowKey={(tecnico) => tecnico.id}
      stats={[{ label: ta({ pt: "Técnicos cadastrados", en: "Registered technicians" }), value: data.total ?? 0, tone: "primary", icon: <TbTool /> }]}
      search={{ placeholder: ta({ pt: "Buscar técnico...", en: "Search technician..." }), text: (tecnico) => [tecnico.name] }}
      columns={[
        { header: ta({ pt: "Nome", en: "Name" }), cell: (tecnico) => <CellTitle title={tecnico.name} /> },
        { header: ta({ pt: "Cadastro", en: "Registration" }), cell: (tecnico) => formatDateTime(tecnico.created_at), className: "whitespace-nowrap" },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioTecnicoAdd", label: ta({ pt: "Novo técnico", en: "New technician" }) }}
      onOpen={(tecnico) => openModal("tecnico", tecnico)}
      remove={{
        request: (tecnico) => ({ url: `/removertecnico/${tecnico.id}`, params: { tecnico_id: tecnico.id } }),
        describe: (tecnico) => tecnico.name,
      }}
      emptyMessage={ta({ pt: "Nenhum técnico cadastrado ainda.", en: "No technicians yet." })}
    />
  );
}
