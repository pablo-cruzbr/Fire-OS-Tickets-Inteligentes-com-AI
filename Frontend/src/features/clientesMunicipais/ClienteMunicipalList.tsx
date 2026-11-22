"use client";

import { ta } from "@/i18n/active";
import { TbBuildingCommunity } from "react-icons/tb";
import { CellTitle, EntityList, optionsFrom } from "@/components/data/EntityList";
import { Badge } from "@/components/ui";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { ClienteMunicipaisResponse, ClientesMunicipaisProps } from "@/lib/getClientesMunicipais.type";

export default function ClienteMunicipalList({ data }: { data: ClienteMunicipaisResponse }) {
  const { openModal } = useGlobalModal();
  const instituicoes = data.controles ?? [];

  return (
    <EntityList<ClientesMunicipaisProps>
      title={ta({ pt: "Clientes municipais", en: "Municipal customers" })}
      breadcrumbs={[{ label: ta({ pt: "Cadastros", en: "New records" }) }, { label: ta({ pt: "Clientes municipais", en: "Municipal customers" }) }]}
      items={instituicoes}
      rowKey={(instituicao) => instituicao.id}
      stats={[
        {
          label: ta({ pt: "Total de instituições", en: "Total institutions" }),
          value: data.total ?? instituicoes.length,
          tone: "primary",
          icon: <TbBuildingCommunity />,
        },
      ]}
      search={{
        placeholder: ta({ pt: "Buscar nome, endereço, telefone ou tipo...", en: "Search name, address, phone or type..." }),
        text: (instituicao) => [
          instituicao.name,
          instituicao.endereco,
          instituicao.telefone,
          instituicao.tipodeinstituicaoUnidade?.name,
        ],
      }}
      filters={[
        {
          label: ta({ pt: "Tipo", en: "Type" }),
          options: (items) => optionsFrom(items, (instituicao) => instituicao.tipodeinstituicaoUnidade?.name),
          match: (instituicao, value) => instituicao.tipodeinstituicaoUnidade?.name === value,
        },
      ]}
      columns={[
        {
          header: ta({ pt: "Instituição", en: "Institution" }),
          cell: (instituicao) => <CellTitle title={instituicao.name} subtitle={instituicao.endereco} />,
        },
        {
          header: ta({ pt: "Tipo", en: "Type" }),
          cell: (instituicao) =>
            instituicao.tipodeinstituicaoUnidade?.name ? (
              <Badge tone="secondary">{instituicao.tipodeinstituicaoUnidade.name}</Badge>
            ) : (
              ta({ pt: "Não informado", en: "Not provided" })
            ),
        },
        { header: ta({ pt: "Telefone", en: "Phone" }), cell: (instituicao) => instituicao.telefone || "—", className: "whitespace-nowrap" },
        {
          header: ta({ pt: "Cadastrado em", en: "Registered on" }),
          cell: (instituicao) => formatDateTime(instituicao.created_at),
          className: "whitespace-nowrap",
        },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioClientesMunicipais", label: ta({ pt: "Nova instituição", en: "New institution" }) }}
      onOpen={(instituicao) => openModal("clienteMunicipal", instituicao)}
      remove={{
        request: (instituicao) => ({ url: "/deleteinstituicao", params: { instituicao_id: instituicao.id } }),
        describe: (instituicao) => instituicao.name,
      }}
      emptyMessage={ta({ pt: "Nenhum cliente municipal cadastrado.", en: "No municipal customers yet." })}
    />
  );
}
