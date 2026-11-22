import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import type { ComprasProps } from "@/lib/getCompras.type";

const statusLookup = { endpoint: "/liststatuscompras" };

function statusId(compra?: ComprasProps) {
  const status = compra?.statusCompras;
  return typeof status === "object" && status && "id" in status ? String((status as { id: string }).id) : "";
}

/** Fields shared by the "nova compra" page and the edit modal. */
export function compraFields(compra?: ComprasProps): FormField[] {
  return [
    { name: "itemSolicitado", label: ta({ pt: "Item solicitado", en: "Requested item" }), required: true, initial: compra?.itemSolicitado, full: true },
    { name: "solicitante", label: ta({ pt: "Solicitante", en: "Requester" }), required: true, initial: compra?.solicitante },
    {
      name: "preco",
      label: ta({ pt: "Preço (R$)", en: "Price (R$)" }),
      type: "number",
      step: "0.01",
      required: true,
      initial: compra?.preco,
    },
    {
      name: "motivoDaSolicitacao",
      label: ta({ pt: "Motivo da solicitação", en: "Reason for the request" }),
      type: "textarea",
      required: true,
      initial: compra?.motivoDaSolicitacao,
    },
    {
      name: "linkDeCompra",
      label: ta({ pt: "Link de compra", en: "Purchase link" }),
      type: "url",
      required: true,
      placeholder: "https://",
      initial: compra?.linkDeCompra,
      full: true,
    },
    {
      name: "statusCompras_id",
      label: ta({ pt: "Status", en: "Status" }),
      type: "select",
      required: true,
      lookup: statusLookup,
      initial: statusId(compra),
    },
  ];
}
