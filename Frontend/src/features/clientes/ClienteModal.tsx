"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { formatDateTime } from "@/lib/format";
import type { ClientesProps } from "@/lib/getCliente.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { clienteEditFields } from "./fields";

export function ClienteModal({ data: cliente, onClose }: EntityModalProps<ClientesProps>) {
  return (
    <DetailModal
      title={cliente.name}
      subtitle={ta({ pt: "Cliente privado", en: "Private customer" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "CNPJ", en: "CNPJ" }), value: cliente.cnpj },
        { label: ta({ pt: "Telefone", en: "Phone" }), value: cliente.telefone },
        { label: ta({ pt: "Cadastrado em", en: "Registered on" }), value: formatDateTime(cliente.created_at) },
        { label: ta({ pt: "Endereço", en: "Address" }), value: cliente.endereco, full: true },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={clienteEditFields(cliente)}
          request={{ method: "patch", url: `/cliente/${cliente.id}` }}
          submitLabel={ta({ pt: "Salvar alterações", en: "Save changes" })}
          successMessage={ta({ pt: "Cliente atualizado!", en: "Customer updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
