"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { formatDateTime } from "@/lib/format";
import type { TecnicosProps } from "@/lib/getTecnicos.type";
import type { EntityModalProps } from "@/features/modalTypes";

/** Read-only: the API has no update route for técnicos. */
export function TecnicoModal({ data: tecnico, onClose }: EntityModalProps<TecnicosProps>) {
  return (
    <DetailModal
      title={tecnico.name}
      subtitle={ta({ pt: "Técnico", en: "Technician" })}
      size="md"
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Nome", en: "Name" }), value: tecnico.name },
        { label: ta({ pt: "Cadastrado em", en: "Registered on" }), value: formatDateTime(tecnico.created_at) },
      ]}
    />
  );
}
