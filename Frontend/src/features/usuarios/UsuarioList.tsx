"use client";

import { ta } from "@/i18n/active";
import { TbUsersGroup } from "react-icons/tb";
import { CellTitle, EntityList } from "@/components/data/EntityList";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { UsuariosProps, UsuariosPropsResponse } from "@/lib/getUsuario.type";

function vinculo(usuario: UsuariosProps) {
  return usuario.cliente?.name ?? usuario.instituicaoUnidade?.name ?? null;
}

export default function UsuarioList({ data }: { data: UsuariosPropsResponse }) {
  const { openModal } = useGlobalModal();
  const usuarios = data.controles ?? [];

  return (
    <EntityList<UsuariosProps>
      title={ta({ pt: "Usuários", en: "Users" })}
      description={ta({ pt: "Usuários cadastrados na plataforma.", en: "Users registered on the platform." })}
      breadcrumbs={[{ label: ta({ pt: "Administração", en: "Administration" }) }, { label: ta({ pt: "Usuários", en: "Users" }) }]}
      items={usuarios}
      rowKey={(usuario) => usuario.id}
      stats={[
        { label: ta({ pt: "Usuários cadastrados", en: "Registered users" }), value: data.total ?? usuarios.length, tone: "primary", icon: <TbUsersGroup /> },
      ]}
      search={{
        placeholder: ta({ pt: "Buscar nome, e-mail, empresa ou instituição...", en: "Search name, email, company or institution..." }),
        text: (usuario) => [usuario.name, usuario.email, usuario.cliente?.name, usuario.instituicaoUnidade?.name],
      }}
      filters={[
        {
          label: ta({ pt: "Vínculo", en: "Link" }),
          options: [
            { value: "cliente", label: ta({ pt: "Clientes", en: "Customers" }) },
            { value: "instituicao", label: ta({ pt: "Instituições", en: "Institutions" }) },
          ],
          match: (usuario, value) =>
            value === "cliente" ? Boolean(usuario.cliente?.name) : Boolean(usuario.instituicaoUnidade?.name),
        },
      ]}
      columns={[
        { header: ta({ pt: "Usuário", en: "User" }), cell: (usuario) => <CellTitle title={usuario.name} subtitle={usuario.email} /> },
        { header: ta({ pt: "Setor", en: "Department" }), cell: (usuario) => usuario.setor?.name ?? "Sem setor" },
        { header: ta({ pt: "Empresa / instituição", en: "Company / institution" }), cell: (usuario) => vinculo(usuario) ?? "—" },
        { header: ta({ pt: "Cadastrado em", en: "Registered on" }), cell: (usuario) => formatDateTime(usuario.created_at), className: "whitespace-nowrap" },
      ]}
      add={{ href: "/signup_empresa", label: ta({ pt: "Novo usuário", en: "New user" }) }}
      onOpen={(usuario) => openModal("usuarios", usuario)}
      emptyMessage={ta({ pt: "Nenhum usuário cadastrado.", en: "No users yet." })}
    />
  );
}
