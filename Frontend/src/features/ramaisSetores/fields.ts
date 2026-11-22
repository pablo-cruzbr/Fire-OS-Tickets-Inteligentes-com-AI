import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import type { RamaisSetoresProps } from "@/lib/getRamaisSetores.type";

const setoresLookup = { endpoint: "/listsetores" };
const clientesLookup = { endpoint: "/listcliente" };
const instituicoesLookup = { endpoint: "/listinstuicao" };

/** "Nenhum" is sent as null, which unlinks the relation (the API accepts null). */
const nullable = (value: string) => value || null;

/**
 * Shared by the create page (POST /informacoessetor) and the edit modal
 * (PATCH /informacoessetor/:id). Both send the same keys.
 */
export function ramalSetorFields(ramal?: RamaisSetoresProps): FormField[] {
  return [
    { name: "usuario", label: ta({ pt: "Usuário responsável", en: "User in charge" }), required: true, initial: ramal?.usuario },
    { name: "ramal", label: ta({ pt: "Ramal", en: "Extension" }), required: true, initial: ramal?.ramal },
    { name: "andar", label: ta({ pt: "Andar", en: "Floor" }), required: true, initial: ramal?.andar },
    {
      name: "setorId",
      label: ta({ pt: "Setor", en: "Department" }),
      type: "select",
      required: true,
      lookup: setoresLookup,
      initial: ramal?.setor?.id,
    },
    {
      name: "clienteId",
      label: ta({ pt: "Cliente", en: "Customer" }),
      type: "select",
      placeholder: ta({ pt: "Nenhum cliente", en: "No customer" }),
      lookup: clientesLookup,
      initial: ramal?.cliente?.id,
      serialize: nullable,
    },
    {
      name: "instituicaoUnidadeId",
      label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }),
      type: "select",
      placeholder: ta({ pt: "Nenhuma instituição", en: "No institution" }),
      lookup: instituicoesLookup,
      initial: ramal?.instituicaoUnidade?.id,
      serialize: nullable,
    },
  ];
}
