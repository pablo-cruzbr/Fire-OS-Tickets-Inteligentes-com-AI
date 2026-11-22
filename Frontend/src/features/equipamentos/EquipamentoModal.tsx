"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { formatDateTime } from "@/lib/format";
import type { EquipamentoProps } from "@/lib/getEquipamento.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { equipamentoFields } from "./fields";

export function EquipamentoModal({ data: equipamento, onClose }: EntityModalProps<EquipamentoProps>) {
  return (
    <DetailModal
      title={equipamento.name}
      subtitle={ta({ pt: "Equipamento", en: "Equipment" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Patrimônio", en: "Asset tag" }), value: equipamento.patrimonio },
        { label: ta({ pt: "Tipo", en: "Type" }), value: equipamento.tipodeEquipamento?.name },
        { label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }), value: equipamento.instituicaoUnidade?.name ?? "Não vinculada" },
        { label: ta({ pt: "Cadastrado em", en: "Registered on" }), value: formatDateTime(equipamento.created_at) },
        { label: ta({ pt: "Endereço da unidade", en: "Unit address" }), value: equipamento.instituicaoUnidade?.endereco, full: true },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={equipamentoFields(equipamento)}
          request={{ method: "patch", url: `/equipamento/${equipamento.id}` }}
          successMessage={ta({ pt: "Equipamento atualizado!", en: "Equipment updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
