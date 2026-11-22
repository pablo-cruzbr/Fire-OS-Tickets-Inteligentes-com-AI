"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { StatusBadge } from "@/components/ui";
import { formatDateTime } from "@/lib/format";
import type { MaquinasPendentesLabProps } from "@/lib/getMaquinasPendentesLab.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { maquinaPendenteLabFields } from "./fields";

export function MaquinasPendentesLabModal({ data: maquina, onClose }: EntityModalProps<MaquinasPendentesLabProps>) {
  return (
    <DetailModal
      title={maquina.equipamento?.name ?? ta({ pt: "Máquina pendente", en: "Pending machine" })}
      subtitle={ta({ pt: "Máquina pendente laboratório", en: "Machine pending in lab" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Patrimônio", en: "Asset tag" }), value: maquina.equipamento?.patrimonio },
        { label: ta({ pt: "Status", en: "Status" }), value: <StatusBadge status={maquina.statusMaquinasPendentesLab?.name} /> },
        { label: ta({ pt: "Número de série", en: "Serial number" }), value: maquina.numeroDeSerie },
        { label: ta({ pt: "ID da OS", en: "Work order ID" }), value: maquina.idDaOs },
        { label: ta({ pt: "SSD", en: "SSD" }), value: maquina.ssd },
        { label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }), value: maquina.instituicaoUnidade?.name },
        { label: ta({ pt: "Criado em", en: "Created on" }), value: formatDateTime(maquina.created_at) },
        { label: ta({ pt: "Observações", en: "Notes" }), value: maquina.obs, full: true },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={maquinaPendenteLabFields(maquina)}
          request={{ method: "patch", url: `/controledemaquinaspendenteslab/update/${maquina.id}` }}
          successMessage={ta({ pt: "Máquina pendente atualizada!", en: "Pending machine updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
