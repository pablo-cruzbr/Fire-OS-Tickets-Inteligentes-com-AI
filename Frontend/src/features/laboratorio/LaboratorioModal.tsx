"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { StatusBadge } from "@/components/ui";
import { formatDate, formatDateTime } from "@/lib/format";
import type { LaboratorioProps } from "@/lib/getLaboratorio.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { laboratorioEditTransform, laboratorioFields } from "./fields";

export function LaboratorioModal({ data: laboratorio, onClose }: EntityModalProps<LaboratorioProps>) {
  return (
    <DetailModal
      title={laboratorio.nomedoEquipamento || ta({ pt: "Controle de laboratório", en: "Lab control" })}
      subtitle={ta({ pt: "Controle de laboratório", en: "Lab control" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Status", en: "Status" }), value: <StatusBadge status={laboratorio.statusControledeLaboratorio?.name} /> },
        { label: ta({ pt: "Patrimônio", en: "Asset tag" }), value: laboratorio.equipamento?.patrimonio },
        { label: ta({ pt: "Marca", en: "Brand" }), value: laboratorio.marca },
        { label: ta({ pt: "Instituição/unidade", en: "Institution/unit" }), value: laboratorio.instituicaoUnidade?.name },
        { label: ta({ pt: "OS de abertura", en: "Opening work order" }), value: laboratorio.osDeAbertura },
        { label: ta({ pt: "OS de devolução", en: "Return work order" }), value: laboratorio.osDeDevolucao },
        { label: ta({ pt: "Data de chegada", en: "Arrival date" }), value: formatDate(laboratorio.data_de_Chegada) },
        { label: ta({ pt: "Data de finalização", en: "Completion date" }), value: formatDate(laboratorio.data_de_Finalizacao) },
        { label: ta({ pt: "Técnico", en: "Technician" }), value: laboratorio.tecnico?.name },
        { label: ta({ pt: "Cliente", en: "Customer" }), value: laboratorio.cliente?.name },
        { label: ta({ pt: "Criado em", en: "Created on" }), value: formatDateTime(laboratorio.created_at) },
        { label: ta({ pt: "Defeito", en: "Defect" }), value: laboratorio.defeito, full: true },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={laboratorioFields(laboratorio)}
          transform={laboratorioEditTransform(laboratorio)}
          request={{ method: "patch", url: `/controledelaboratorio/update/${laboratorio.id}` }}
          successMessage={ta({ pt: "Controle de laboratório atualizado!", en: "Lab control updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
