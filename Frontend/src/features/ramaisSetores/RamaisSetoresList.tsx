"use client";

import { ta } from "@/i18n/active";
import { TbBuilding, TbBuildingCommunity, TbPhone } from "react-icons/tb";
import { CellTitle, EntityList } from "@/components/data/EntityList";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import type { RamaisSetoresProps } from "@/lib/getRamaisSetores.type";

function vinculo(ramal: RamaisSetoresProps) {
  return ramal.cliente?.name ?? ramal.instituicaoUnidade?.name ?? null;
}

export default function RamaisSetoresList({ data }: { data: RamaisSetoresProps[] }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<RamaisSetoresProps>
      title={ta({ pt: "Ramais e setores", en: "Extensions and departments" })}
      breadcrumbs={[{ label: ta({ pt: "Cadastros", en: "New records" }) }, { label: ta({ pt: "Ramais e setores", en: "Extensions and departments" }) }]}
      items={data}
      rowKey={(ramal) => ramal.id}
      stats={[
        { label: ta({ pt: "Total de ramais", en: "Total extensions" }), value: data.length, tone: "primary", icon: <TbPhone /> },
        {
          label: ta({ pt: "De clientes", en: "From customers" }),
          value: data.filter((ramal) => ramal.cliente?.name).length,
          tone: "secondary",
          icon: <TbBuilding />,
        },
        {
          label: ta({ pt: "De instituições", en: "From institutions" }),
          value: data.filter((ramal) => ramal.instituicaoUnidade?.name).length,
          tone: "success",
          icon: <TbBuildingCommunity />,
        },
      ]}
      search={{
        placeholder: ta({ pt: "Buscar usuário, ramal ou setor...", en: "Search user, extension or department..." }),
        text: (ramal) => [ramal.usuario, ramal.ramal, ramal.setor?.name, vinculo(ramal)],
      }}
      filters={[
        {
          label: ta({ pt: "Vínculo", en: "Link" }),
          options: [
            { value: "cliente", label: ta({ pt: "Apenas clientes", en: "Customers only" }) },
            { value: "instituicao", label: ta({ pt: "Apenas instituições", en: "Institutions only" }) },
          ],
          match: (ramal, value) =>
            value === "cliente" ? Boolean(ramal.cliente?.name) : Boolean(ramal.instituicaoUnidade?.name),
        },
      ]}
      columns={[
        { header: ta({ pt: "Usuário", en: "User" }), cell: (ramal) => <CellTitle title={ramal.usuario} subtitle={ramal.andar} /> },
        { header: ta({ pt: "Ramal", en: "Extension" }), cell: (ramal) => ramal.ramal, className: "whitespace-nowrap" },
        { header: ta({ pt: "Setor", en: "Department" }), cell: (ramal) => ramal.setor?.name ?? "—" },
        { header: ta({ pt: "Cliente / instituição", en: "Customer / institution" }), cell: (ramal) => vinculo(ramal) ?? "—" },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioRamaisSetores", label: ta({ pt: "Novo ramal", en: "New extension" }) }}
      onOpen={(ramal) => openModal("ramaisSetores", ramal)}
      emptyMessage={ta({ pt: "Nenhum ramal cadastrado.", en: "No extensions yet." })}
    />
  );
}
