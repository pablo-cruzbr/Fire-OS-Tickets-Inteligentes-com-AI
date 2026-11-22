import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";

/** POST /categorysetor. There is no update route for setores, so no edit modal. */
export function setorFields(): FormField[] {
  return [{ name: "name", label: ta({ pt: "Nome do setor", en: "Department name" }), required: true, full: true, placeholder: ta({ pt: "Ex.: Financeiro", en: "E.g. Finance" }) }];
}
