"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { StatusBadge } from "@/components/ui";
import { formatDate, formatDateTime, formatMonthYear } from "@/lib/format";
import type { AssistenciaTecnicaProps } from "@/lib/getAssistenciaTecnica.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { assistenciaTecnicaFields } from "./fields";

export function AssistenciaTecnicaModal({ data: assistencia, onClose }: EntityModalProps<AssistenciaTecnicaProps>) {
  const equipamento = assistencia.equipamento;

  return (
    <DetailModal
      title={assistencia.name || equipamento?.name || ta({ pt: "Assistência técnica", en: "Repair service" })}
      subtitle={ta({ pt: "Assistência técnica", en: "Repair service" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Status", en: "Status" }), value: <StatusBadge status={assistencia.statusReparo?.name} /> },
        { label: ta({ pt: "Cliente", en: "Customer" }), value: assistencia.cliente?.name },
        { label: ta({ pt: "Equipamento", en: "Equipment" }), value: equipamento?.name },
        { label: ta({ pt: "Patrimônio", en: "Asset tag" }), value: equipamento?.patrimonio },
        { label: ta({ pt: "Assistência", en: "Repair service" }), value: assistencia.assistencia },
        { label: ta({ pt: "OS da assistência", en: "Repair work order" }), value: assistencia.osDaAssistencia },
        { label: ta({ pt: "ID do chamado", en: "Ticket ID" }), value: assistencia.idChamado },
        { label: ta({ pt: "Técnico responsável", en: "Technician in charge" }), value: assistencia.tecnico?.name },
        { label: ta({ pt: "Instituição/unidade", en: "Institution/unit" }), value: assistencia.instituicaoUnidade?.name },
        { label: ta({ pt: "Mês/ano", en: "Month/year" }), value: formatMonthYear(assistencia.mesAno) },
        { label: ta({ pt: "Data de retirada", en: "Pickup date" }), value: formatDate(assistencia.dataDeRetirada) },
        { label: ta({ pt: "Criado em", en: "Created on" }), value: formatDateTime(assistencia.created_at) },
        { label: ta({ pt: "Observações", en: "Notes" }), value: assistencia.observacoes, full: true },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={assistenciaTecnicaFields(assistencia)}
          request={{ method: "patch", url: `/assistenciatecnica/update/${assistencia.id}` }}
          successMessage={ta({ pt: "Assistência técnica atualizada!", en: "Repair service updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
