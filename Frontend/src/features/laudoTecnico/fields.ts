import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import { toDateInput } from "@/lib/format";
import type { LaudoTecnicoProps } from "@/lib/getLaudoTecnico.type";
import { equipamentoLookup, instituicaoLookup, tecnicoLookup } from "@/features/controleLookups";

/** Fields shared by the "novo laudo técnico" page and the edit modal. */
export function laudoTecnicoFields(laudo?: LaudoTecnicoProps): FormField[] {
  const creating = !laudo;

  return [
    { name: "osLab", label: ta({ pt: "OS do laboratório", en: "Lab work order" }), required: true, initial: laudo?.osLab },
    // The old forms used a full date picker for "mês/ano", so the day is kept.
    { name: "mesAno", label: ta({ pt: "Data (mês/ano)", en: "Date (month/year)" }), type: "date", required: true, initial: toDateInput(laudo?.mesAno) },
    {
      name: "equipamento_id",
      label: ta({ pt: "Equipamento", en: "Equipment" }),
      type: "select",
      required: creating,
      lookup: equipamentoLookup,
      initial: laudo?.equipamento?.id,
    },
    {
      name: "instituicaoUnidade_id",
      label: ta({ pt: "Instituição/unidade", en: "Institution/unit" }),
      type: "select",
      required: true,
      lookup: instituicaoLookup,
      initial: laudo?.instituicaoUnidade?.id,
    },
    {
      name: "tecnico_id",
      label: ta({ pt: "Técnico", en: "Technician" }),
      type: "select",
      required: true,
      lookup: tecnicoLookup,
      initial: laudo?.tecnico?.id,
    },
    {
      name: "descricaodoProblema",
      label: ta({ pt: "Descrição do problema", en: "Problem description" }),
      type: "textarea",
      required: true,
      initial: laudo?.descricaodoProblema,
    },
  ];
}
