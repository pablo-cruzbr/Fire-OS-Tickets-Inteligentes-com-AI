import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";

/** Create only: the API has no update route for técnicos. */
export function tecnicoFields(): FormField[] {
  return [{ name: "name", label: ta({ pt: "Nome do técnico", en: "Technician name" }), required: true, placeholder: ta({ pt: "Nome completo", en: "Full name" }), full: true }];
}
