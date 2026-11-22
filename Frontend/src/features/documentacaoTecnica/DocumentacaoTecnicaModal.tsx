"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { formatDateTime } from "@/lib/format";
import type { DocumentacaoTecnicaProps } from "@/lib/getDocumentacaoTecnica.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { documentacaoFields } from "./fields";

export function DocumentacaoTecnicaModal({ data: doc, onClose }: EntityModalProps<DocumentacaoTecnicaProps>) {
  return (
    <DetailModal
      title={doc.titulo}
      subtitle={ta({ pt: "Documentação técnica", en: "Technical documentation" })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Técnico", en: "Technician" }), value: doc.tecnico?.name },
        { label: ta({ pt: "Criado em", en: "Created on" }), value: formatDateTime(doc.created_at) },
        { label: ta({ pt: "Cliente", en: "Customer" }), value: doc.cliente?.name },
        { label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }), value: doc.instituicaoUnidade?.name },
        {
          label: ta({ pt: "Descrição", en: "Description" }),
          value: doc.descricao ? <span className="whitespace-pre-wrap">{doc.descricao}</span> : null,
          full: true,
        },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={documentacaoFields(doc)}
          request={{ method: "patch", url: `/documentacaotecnica/update/${doc.id}` }}
          submitLabel={ta({ pt: "Salvar alterações", en: "Save changes" })}
          successMessage={ta({ pt: "Documentação atualizada!", en: "Documentation updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
