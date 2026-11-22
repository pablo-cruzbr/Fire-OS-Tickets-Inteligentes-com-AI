"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { StatusBadge } from "@/components/ui";
import { formatDate, formatDateTime } from "@/lib/format";
import type { EstabilizadoresProps } from "@/lib/getEstabilizadores.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { controleEstabilizadorFields } from "./fields";

export function EstabilizadoresModal({ data: controle, onClose }: EntityModalProps<EstabilizadoresProps>) {
  const estabilizador = controle.estabilizadores;

  return (
    <DetailModal
      title={estabilizador?.name ?? ta({ pt: "Controle de estabilizador", en: "Stabilizer control" })}
      subtitle={ta({ pt: "Controle de estabilizadores", en: "Stabilizer controls" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Status", en: "Status" }), value: <StatusBadge status={controle.statusEstabilizadores?.name} /> },
        { label: ta({ pt: "Patrimônio", en: "Asset tag" }), value: estabilizador?.patrimonio },
        { label: ta({ pt: "ID do chamado", en: "Ticket ID" }), value: controle.idChamado },
        { label: ta({ pt: "OS da assistência", en: "Repair work order" }), value: controle.osdaAssistencia },
        { label: ta({ pt: "Data de chegada", en: "Arrival date" }), value: formatDate(controle.datadeChegada) },
        { label: ta({ pt: "Data de retirada", en: "Pickup date" }), value: formatDate(controle.datadeRetirada) },
        { label: ta({ pt: "Instituição/unidade", en: "Institution/unit" }), value: controle.instituicaoUnidade?.name },
        { label: ta({ pt: "Endereço", en: "Address" }), value: controle.instituicaoUnidade?.endereco },
        { label: ta({ pt: "Criado em", en: "Created on" }), value: formatDateTime(controle.created_at) },
        { label: ta({ pt: "Problema", en: "Problem" }), value: controle.problema, full: true },
        { label: ta({ pt: "Observações", en: "Notes" }), value: controle.observacoes, full: true },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={controleEstabilizadorFields(controle)}
          request={{ method: "patch", url: `/update/controledeestabilizadores/${controle.id}` }}
          successMessage={ta({ pt: "Estabilizador atualizado!", en: "Stabilizer updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
