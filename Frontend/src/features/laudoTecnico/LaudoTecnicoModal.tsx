"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { formatDate, formatDateTime } from "@/lib/format";
import type { LaudoTecnicoProps } from "@/lib/getLaudoTecnico.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { laudoTecnicoFields } from "./fields";

export function LaudoTecnicoModal({ data: laudo, onClose }: EntityModalProps<LaudoTecnicoProps>) {
  return (
    <DetailModal
      title={laudo.osLab ? ta({ pt: `Laudo ${laudo.osLab}`, en: `Report ${laudo.osLab}` }) : ta({ pt: "Laudo técnico", en: "Technical report" })}
      subtitle={ta({ pt: "Laudo técnico", en: "Technical report" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "OS do laboratório", en: "Lab work order" }), value: laudo.osLab },
        { label: ta({ pt: "Data (mês/ano)", en: "Date (month/year)" }), value: formatDate(laudo.mesAno) },
        { label: ta({ pt: "Equipamento", en: "Equipment" }), value: laudo.equipamento?.name },
        { label: ta({ pt: "Patrimônio", en: "Asset tag" }), value: laudo.equipamento?.patrimonio },
        { label: ta({ pt: "Instituição/unidade", en: "Institution/unit" }), value: laudo.instituicaoUnidade?.name },
        { label: ta({ pt: "Endereço", en: "Address" }), value: laudo.instituicaoUnidade?.endereco },
        { label: ta({ pt: "Técnico responsável", en: "Technician in charge" }), value: laudo.tecnico?.name },
        { label: ta({ pt: "Criado em", en: "Created on" }), value: formatDateTime(laudo.created_at) },
        { label: ta({ pt: "Descrição do problema", en: "Problem description" }), value: laudo.descricaodoProblema, full: true },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={laudoTecnicoFields(laudo)}
          request={{ method: "patch", url: `/laudotecnico/update/${laudo.id}` }}
          successMessage={ta({ pt: "Laudo técnico atualizado!", en: "Technical report updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
