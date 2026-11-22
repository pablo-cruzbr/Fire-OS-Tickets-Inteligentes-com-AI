"use client";

import { ta } from "@/i18n/active";
import { TbBuildingStore } from "react-icons/tb";
import { CellTitle, EntityList } from "@/components/data/EntityList";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { ClienteResponse, ClientesProps } from "@/lib/getCliente.type";

export default function ClientesList({ data }: { data: ClienteResponse }) {
  const { openModal } = useGlobalModal();
  const clientes = data.controles ?? [];

  return (
    <EntityList<ClientesProps>
      title={ta({ pt: "Clientes privados", en: "Private customers" })}
      breadcrumbs={[{ label: ta({ pt: "Cadastros", en: "New records" }) }, { label: ta({ pt: "Clientes privados", en: "Private customers" }) }]}
      items={clientes}
      rowKey={(cliente) => cliente.id}
      stats={[{ label: ta({ pt: "Total de clientes", en: "Total customers" }), value: data.total ?? clientes.length, tone: "primary", icon: <TbBuildingStore /> }]}
      search={{
        placeholder: ta({ pt: "Buscar nome, CNPJ ou endereço...", en: "Search name, tax ID or address..." }),
        text: (cliente) => [cliente.name, cliente.cnpj, cliente.endereco, cliente.telefone],
      }}
      columns={[
        { header: ta({ pt: "Cliente", en: "Customer" }), cell: (cliente) => <CellTitle title={cliente.name} subtitle={cliente.endereco} /> },
        { header: ta({ pt: "CNPJ", en: "CNPJ" }), cell: (cliente) => cliente.cnpj || "Não cadastrado", className: "whitespace-nowrap" },
        { header: ta({ pt: "Telefone", en: "Phone" }), cell: (cliente) => cliente.telefone || "—", className: "whitespace-nowrap" },
        { header: ta({ pt: "Cadastrado em", en: "Registered on" }), cell: (cliente) => formatDateTime(cliente.created_at), className: "whitespace-nowrap" },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioClientesPrivados", label: ta({ pt: "Novo cliente", en: "New customer" }) }}
      onOpen={(cliente) => openModal("cliente", cliente)}
      remove={{
        request: (cliente) => ({ url: `/deletecliente/${cliente.id}` }),
        describe: (cliente) => cliente.name,
      }}
      emptyMessage={ta({ pt: "Nenhum cliente privado cadastrado.", en: "No private customers yet." })}
    />
  );
}
