"use client";

import { ta } from "@/i18n/active";
import { TbCircleCheck, TbShoppingCart, TbTruckDelivery, TbHourglass } from "react-icons/tb";
import { CellTitle, EntityList, optionsFrom } from "@/components/data/EntityList";
import { StatusBadge } from "@/components/ui";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { relationName } from "@/lib/status";
import type { ComprasProps, ComprasResponse } from "@/lib/getCompras.type";

export default function ComprasList({ data }: { data: ComprasResponse }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<ComprasProps>
      title={ta({ pt: "Compras", en: "Purchasing" })}
      breadcrumbs={[{ label: ta({ pt: "Controles", en: "Controls" }) }, { label: ta({ pt: "Compras", en: "Purchasing" }) }]}
      items={data.controles}
      rowKey={(compra) => compra.id}
      stats={[
        { label: ta({ pt: "Total", en: "Total" }), value: data.total, tone: "primary", icon: <TbShoppingCart /> },
        { label: ta({ pt: "Aguardando compra", en: "Awaiting purchase" }), value: data.totalAguardandoCompra, tone: "warning", icon: <TbHourglass /> },
        { label: ta({ pt: "Aguardando entrega", en: "Awaiting delivery" }), value: data.totalAguardandoEntrega, tone: "secondary", icon: <TbTruckDelivery /> },
        { label: ta({ pt: "Compra finalizada", en: "Purchase completed" }), value: data.totalCompraFinalizada, tone: "success", icon: <TbCircleCheck /> },
      ]}
      search={{
        placeholder: ta({ pt: "Buscar item ou solicitante...", en: "Search item or requester..." }),
        text: (compra) => [compra.itemSolicitado, compra.solicitante],
      }}
      filters={[
        {
          label: ta({ pt: "Status", en: "Status" }),
          options: (items) => optionsFrom(items, (compra) => relationName(compra.statusCompras, "")),
          match: (compra, value) => relationName(compra.statusCompras) === value,
        },
      ]}
      columns={[
        {
          header: ta({ pt: "Item", en: "Item" }),
          cell: (compra) => <CellTitle title={compra.itemSolicitado} subtitle={compra.motivoDaSolicitacao} />,
        },
        { header: ta({ pt: "Solicitante", en: "Requester" }), cell: (compra) => compra.solicitante },
        { header: ta({ pt: "Preço", en: "Price" }), cell: (compra) => formatCurrency(compra.preco), className: "whitespace-nowrap" },
        { header: ta({ pt: "Status", en: "Status" }), cell: (compra) => <StatusBadge status={relationName(compra.statusCompras, "")} /> },
        { header: ta({ pt: "Data", en: "Date" }), cell: (compra) => formatDateTime(compra.created_at), className: "whitespace-nowrap" },
      ]}
      add={{ href: "/dashboard/compras/formularioCompras", label: ta({ pt: "Fazer um pedido", en: "Place an order" }) }}
      onOpen={(compra) => openModal("compras", compra)}
      remove={{
        request: (compra) => ({
          url: `/deletedesolicitacaodecompras/${compra.id}`,
          params: { compra_id: compra.id },
        }),
        describe: (compra) => compra.itemSolicitado,
      }}
      emptyMessage={ta({ pt: "Nenhuma solicitação de compra ainda.", en: "No purchase requests yet." })}
    />
  );
}
