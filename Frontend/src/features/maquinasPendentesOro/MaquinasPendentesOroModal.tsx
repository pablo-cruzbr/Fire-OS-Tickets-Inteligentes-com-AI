"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { StatusBadge } from "@/components/ui";
import { formatDate, formatDateTime } from "@/lib/format";
import type { MaquinasPendentesOroProps } from "@/lib/getMaquinasPendentesOro.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { maquinaPendenteOroFields } from "./fields";

export function MaquinasPendentesOroModal({ data: maquina, onClose }: EntityModalProps<MaquinasPendentesOroProps>) {
  return (
    <DetailModal
      title={maquina.equipamento?.name ?? ta({ pt: "Máquina pendente", en: "Pending machine" })}
      subtitle={ta({ pt: "Máquina pendente ORO", en: "Pending ORO machine" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Patrimônio", en: "Asset tag" }), value: maquina.equipamento?.patrimonio },
        { label: ta({ pt: "Status", en: "Status" }), value: <StatusBadge status={maquina.statusMaquinasPendentesOro?.name} /> },
        { label: ta({ pt: "Data da instalação", en: "Installation date" }), value: formatDate(maquina.datadaInstalacao) },
        { label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }), value: maquina.instituicaoUnidade?.name },
        { label: ta({ pt: "OS de instalação", en: "Installation work order" }), value: maquina.osInstalacao },
        { label: ta({ pt: "OS de retirada", en: "Pickup work order" }), value: maquina.osRetirada },
        { label: ta({ pt: "Criado em", en: "Created on" }), value: formatDateTime(maquina.created_at) },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={maquinaPendenteOroFields(maquina)}
          request={{ method: "patch", url: `/controledemaquinaspendentesoro/update/${maquina.id}` }}
          successMessage={ta({ pt: "Máquina pendente atualizada!", en: "Pending machine updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
