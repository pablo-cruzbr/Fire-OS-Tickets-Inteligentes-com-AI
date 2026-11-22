"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { formatDateTime } from "@/lib/format";
import type { ClientesMunicipaisProps } from "@/lib/getClientesMunicipais.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { clienteMunicipalFields } from "./fields";

export function ClienteMunicipalModal({ data: instituicao, onClose }: EntityModalProps<ClientesMunicipaisProps>) {
  return (
    <DetailModal
      title={instituicao.name}
      subtitle={ta({ pt: "Cliente municipal", en: "Municipal customer" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Tipo de unidade", en: "Unit type" }), value: instituicao.tipodeinstituicaoUnidade?.name },
        { label: ta({ pt: "Telefone", en: "Phone" }), value: instituicao.telefone },
        { label: ta({ pt: "Cadastrado em", en: "Registered on" }), value: formatDateTime(instituicao.created_at) },
        { label: ta({ pt: "Endereço", en: "Address" }), value: instituicao.endereco, full: true },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={clienteMunicipalFields(instituicao)}
          request={{ method: "patch", url: `/instituicaounidade/update/${instituicao.id}` }}
          transform={(payload) => ({ id: instituicao.id, ...payload })}
          submitLabel={ta({ pt: "Salvar alterações", en: "Save changes" })}
          successMessage={ta({ pt: "Instituição atualizada!", en: "Institution updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
