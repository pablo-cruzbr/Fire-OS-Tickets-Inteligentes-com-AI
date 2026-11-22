"use client";

import { ta } from "@/i18n/active";
import { TbSitemap } from "react-icons/tb";
import { EntityList } from "@/components/data/EntityList";
import type { SetoresProps } from "@/lib/getSetores.type";

export default function SetoresList({ data }: { data: SetoresProps[] }) {
  return (
    <EntityList<SetoresProps>
      title={ta({ pt: "Setores", en: "Departments" })}
      breadcrumbs={[{ label: ta({ pt: "Cadastros", en: "New records" }) }, { label: ta({ pt: "Setores", en: "Departments" }) }]}
      items={data}
      rowKey={(setor) => setor.id}
      stats={[{ label: ta({ pt: "Total de setores", en: "Total departments" }), value: data.length, tone: "primary", icon: <TbSitemap /> }]}
      search={{ placeholder: ta({ pt: "Buscar setor...", en: "Search department..." }), text: (setor) => [setor.name] }}
      columns={[{ header: ta({ pt: "Setor", en: "Department" }), cell: (setor) => <span className="font-semibold text-link">{setor.name}</span> }]}
      add={{ href: "/dashboard/formulariosadd/formularioSetores", label: ta({ pt: "Novo setor", en: "New department" }) }}
      remove={{
        request: (setor) => ({ url: "/deletesetor", params: { setor_id: setor.id } }),
        describe: (setor) => setor.name,
      }}
      emptyMessage={ta({ pt: "Nenhum setor cadastrado.", en: "No departments yet." })}
    />
  );
}
