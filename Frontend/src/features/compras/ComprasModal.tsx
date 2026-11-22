"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { StatusBadge } from "@/components/ui";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { relationName } from "@/lib/status";
import type { ComprasProps } from "@/lib/getCompras.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { compraFields } from "./fields";

export function ComprasModal({ data: compra, onClose }: EntityModalProps<ComprasProps>) {
  return (
    <DetailModal
      title={compra.itemSolicitado}
      subtitle={ta({ pt: "Solicitação de compra", en: "Purchase request" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Solicitante", en: "Requester" }), value: compra.solicitante },
        { label: ta({ pt: "Status", en: "Status" }), value: <StatusBadge status={relationName(compra.statusCompras, "")} /> },
        { label: ta({ pt: "Preço", en: "Price" }), value: formatCurrency(compra.preco) },
        { label: ta({ pt: "Criado em", en: "Created on" }), value: formatDateTime(compra.created_at) },
        { label: ta({ pt: "Motivo da solicitação", en: "Reason for the request" }), value: compra.motivoDaSolicitacao, full: true },
        {
          label: ta({ pt: "Link de compra", en: "Purchase link" }),
          full: true,
          value: compra.linkDeCompra ? (
            <a
              href={compra.linkDeCompra}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primarytext underline-offset-2 hover:underline"
            >
              {compra.linkDeCompra}
            </a>
          ) : null,
        },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={compraFields(compra)}
          request={{ method: "patch", url: `/compra/update/${compra.id}` }}
          successMessage={ta({ pt: "Compra atualizada!", en: "Purchase updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
