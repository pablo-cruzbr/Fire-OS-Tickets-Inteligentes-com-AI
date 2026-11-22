"use client";

import { ta } from "@/i18n/active";
import { DetailModal } from "@/components/data/DetailModal";
import { EntityForm } from "@/components/data/EntityForm";
import { formatDateTime } from "@/lib/format";
import type { UsuariosProps } from "@/lib/getUsuario.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { usuarioEditFields } from "./fields";

export function UsuarioModal({ data: usuario, onClose }: EntityModalProps<UsuariosProps>) {
  return (
    <DetailModal
      title={usuario.name}
      subtitle={usuario.email}
      onClose={onClose}
      fields={[
        { label: ta({ pt: "E-mail", en: "Email" }), value: usuario.email },
        { label: ta({ pt: "Setor", en: "Department" }), value: usuario.setor?.name },
        { label: ta({ pt: "Empresa / cliente", en: "Company / customer" }), value: usuario.cliente?.name },
        { label: ta({ pt: "Vínculo unidade", en: "Linked unit" }), value: usuario.instituicaoUnidade?.name ?? "Nenhum vínculo" },
        { label: ta({ pt: "Técnico responsável", en: "Technician in charge" }), value: usuario.tecnico?.name ?? "Não atribuído" },
        { label: ta({ pt: "Cadastrado em", en: "Registered on" }), value: formatDateTime(usuario.created_at) },
        {
          label: ta({ pt: "Localização", en: "Location" }),
          value: usuario.cliente?.endereco ?? usuario.instituicaoUnidade?.endereco,
          full: true,
        },
      ]}
      renderEdit={(done, cancel) => (
        <EntityForm
          fields={usuarioEditFields(usuario)}
          request={{ method: "patch", url: `/user/update/${usuario.id}` }}
          submitLabel={ta({ pt: "Salvar alterações", en: "Save changes" })}
          successMessage={ta({ pt: "Usuário atualizado!", en: "User updated!" })}
          onSuccess={done}
          onCancel={cancel}
        />
      )}
    />
  );
}
