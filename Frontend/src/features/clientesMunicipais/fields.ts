import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import type { ClientesMunicipaisProps } from "@/lib/getClientesMunicipais.type";

const tiposLookup = { endpoint: "/listtipodeinstituicaounidade" };

/** Shared by the "nova instituição" page (POST /categoryintituicao) and the edit modal. */
export function clienteMunicipalFields(instituicao?: ClientesMunicipaisProps): FormField[] {
  return [
    { name: "name", label: ta({ pt: "Nome da instituição / unidade", en: "Institution / unit name" }), required: true, initial: instituicao?.name, full: true },
    { name: "endereco", label: ta({ pt: "Endereço", en: "Address" }), required: true, initial: instituicao?.endereco, full: true },
    {
      name: "telefone",
      label: ta({ pt: "Telefone", en: "Phone" }),
      type: "tel",
      // the create form always required it; on edit the API treats it as optional
      required: !instituicao,
      placeholder: "(11) 0000-0000",
      initial: instituicao?.telefone,
    },
    {
      name: "tipodeInstituicaoUnidade_id",
      label: ta({ pt: "Tipo de instituição", en: "Institution type" }),
      type: "select",
      required: true,
      lookup: tiposLookup,
      initial: instituicao?.tipodeinstituicaoUnidade?.id,
    },
  ];
}
