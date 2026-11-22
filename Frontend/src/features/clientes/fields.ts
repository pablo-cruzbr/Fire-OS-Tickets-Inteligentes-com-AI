import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import type { ClientesProps } from "@/lib/getCliente.type";

/** "Novo cliente" page: the old form only sent name, endereco and cnpj. */
export function clienteCreateFields(): FormField[] {
  return [
    { name: "name", label: ta({ pt: "Nome da empresa", en: "Company name" }), required: true, full: true, placeholder: ta({ pt: "Ex.: Nome da Empresa Ltda", en: "E.g. Company Name Ltd" }) },
    { name: "endereco", label: ta({ pt: "Endereço", en: "Address" }), required: true, full: true, placeholder: ta({ pt: "Rua, número, bairro, cidade - UF", en: "Street, number, neighborhood, city - state" }) },
    // text, not number: a numeric input drops leading zeros and rejects the mask
    { name: "cnpj", label: ta({ pt: "CNPJ", en: "CNPJ" }), required: true, placeholder: "00.000.000/0000-00" },
  ];
}

/** Edit modal: PATCH /cliente/:id with name, cnpj, endereco and telefone. */
export function clienteEditFields(cliente: ClientesProps): FormField[] {
  return [
    { name: "name", label: ta({ pt: "Nome do cliente / razão social", en: "Customer name / legal name" }), required: true, initial: cliente.name, full: true },
    { name: "cnpj", label: ta({ pt: "CNPJ", en: "CNPJ" }), required: true, placeholder: "00.000.000/0000-00", initial: cliente.cnpj },
    { name: "telefone", label: ta({ pt: "Telefone", en: "Phone" }), type: "tel", placeholder: "(11) 0000-0000", initial: cliente.telefone },
    {
      name: "endereco",
      label: ta({ pt: "Endereço completo", en: "Full address" }),
      type: "textarea",
      placeholder: ta({ pt: "Rua, número, bairro, cidade - UF", en: "Street, number, neighborhood, city - state" }),
      initial: cliente.endereco,
    },
  ];
}
