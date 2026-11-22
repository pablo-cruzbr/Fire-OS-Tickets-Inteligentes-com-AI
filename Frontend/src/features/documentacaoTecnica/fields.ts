import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import type { DocumentacaoTecnicaProps } from "@/lib/getDocumentacaoTecnica.type";

const tecnicosLookup = { endpoint: "/listtecnico" };
const clientesLookup = { endpoint: "/listcliente" };
const instituicoesLookup = { endpoint: "/listinstuicao" };

/**
 * Shared by the create page (POST /documentacaotecnica) and the edit modal
 * (PATCH /documentacaotecnica/update/:id). Optional relations left empty are
 * omitted from the payload — the API validates them as optional uuids and
 * rejects both null and "".
 */
export function documentacaoFields(doc?: DocumentacaoTecnicaProps): FormField[] {
  return [
    { name: "titulo", label: ta({ pt: "Título", en: "Title" }), required: true, initial: doc?.titulo, full: true },
    {
      name: "descricao",
      label: ta({ pt: "Descrição", en: "Description" }),
      type: "textarea",
      required: true,
      placeholder: ta({ pt: "Adicione suas anotações", en: "Add your notes" }),
      initial: doc?.descricao,
    },
    {
      name: "tecnico_id",
      label: ta({ pt: "Técnico", en: "Technician" }),
      type: "select",
      required: true,
      lookup: tecnicosLookup,
      initial: doc?.tecnico?.id,
    },
    {
      name: "cliente_id",
      label: ta({ pt: "Cliente", en: "Customer" }),
      type: "select",
      placeholder: ta({ pt: "Nenhum (opcional)", en: "None (optional)" }),
      lookup: clientesLookup,
      initial: doc?.cliente?.id,
    },
    {
      name: "instituicaoUnidade_id",
      label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }),
      type: "select",
      placeholder: ta({ pt: "Nenhuma (opcional)", en: "None (optional)" }),
      lookup: instituicoesLookup,
      initial: doc?.instituicaoUnidade?.id,
    },
  ];
}
