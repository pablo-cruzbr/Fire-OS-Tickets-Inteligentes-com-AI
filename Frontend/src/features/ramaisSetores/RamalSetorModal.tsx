"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import type { RamaisSetoresProps } from "@/lib/getRamaisSetores.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { ramalSetorFields } from "./fields";

export function RamalSetorModal({ data: ramal, onClose }: EntityModalProps<RamaisSetoresProps>) {
  return (
    <DetailModal
      title={ramal.usuario}
      subtitle={ta({ pt: `Ramal ${ramal.ramal}`, en: `Extension ${ramal.ramal}` })}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "Ramal", en: "Extension" }), value: ramal.ramal },
        { label: ta({ pt: "Andar", en: "Floor" }), value: ramal.andar },
        { label: ta({ pt: "Setor", en: "Department" }), value: ramal.setor?.name },
        { label: ta({ pt: "Vínculo", en: "Link" }), value: ramal.cliente?.name ?? ramal.instituicaoUnidade?.name ?? "Nenhum vínculo" },
        {
          label: ta({ pt: "Localização", en: "Location" }),
          value: ramal.cliente?.endereco ?? ramal.instituicaoUnidade?.endereco,
          full: true,
        },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={ramalSetorFields(ramal)}
          request={{ method: "patch", url: `/informacoessetor/${ramal.id}` }}
          transform={(payload) => ({ id: ramal.id, ...payload })}
          submitLabel={ta({ pt: "Salvar alterações", en: "Save changes" })}
          successMessage={ta({ pt: "Ramal atualizado!", en: "Extension updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
