import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import type { UsuariosProps } from "@/lib/getUsuario.type";

const setoresLookup = { endpoint: "/listsetores" };
const clientesLookup = { endpoint: "/listcliente" };
const instituicoesLookup = { endpoint: "/listinstuicao" };

/**
 * Edit modal only (PATCH /user/update/:id). New users are created through
 * /signup_empresa and /signup_instituicao.
 *
 * Empty selects are left out of the payload: the API validates these ids as
 * optional uuids and rejects null (the old form sent null and always got 400).
 */
export function usuarioEditFields(usuario: UsuariosProps): FormField[] {
  return [
    { name: "name", label: ta({ pt: "Nome do usuário", en: "User name" }), required: true, initial: usuario.name },
    { name: "email", label: ta({ pt: "E-mail", en: "Email" }), type: "email", required: true, initial: usuario.email },
    {
      name: "setor_id",
      label: ta({ pt: "Setor", en: "Department" }),
      type: "select",
      placeholder: ta({ pt: "Selecione um setor", en: "Select a department" }),
      lookup: setoresLookup,
      initial: usuario.setor?.id,
    },
    {
      name: "cliente_id",
      label: ta({ pt: "Cliente / empresa", en: "Customer / company" }),
      type: "select",
      placeholder: ta({ pt: "Selecione um cliente", en: "Select a customer" }),
      lookup: clientesLookup,
      initial: usuario.cliente?.id,
    },
    {
      name: "instituicaoUnidade_id",
      label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }),
      type: "select",
      placeholder: ta({ pt: "Selecione uma instituição", en: "Select an institution" }),
      lookup: instituicoesLookup,
      initial: usuario.instituicaoUnidade?.id,
      full: true,
    },
  ];
}
