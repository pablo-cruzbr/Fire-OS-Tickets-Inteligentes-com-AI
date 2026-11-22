import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import { toDateInput, toMonthInput } from "@/lib/format";
import type { AssistenciaTecnicaProps } from "@/lib/getAssistenciaTecnica.type";
import { clienteLookup, equipamentoLookup, instituicaoLookup, tecnicoLookup } from "@/features/controleLookups";

const statusReparoLookup = { endpoint: "/liststatusreparo" };

/**
 * Fields of the "nova assistência técnica" page (no argument) and of the edit
 * modal (with the record). Both send the same keys.
 */
export function assistenciaTecnicaFields(assistencia?: AssistenciaTecnicaProps): FormField[] {
  const creating = !assistencia;

  return [
    { name: "name", label: ta({ pt: "Nome do registro", en: "Record name" }), required: true, initial: assistencia?.name, full: true },
    { name: "mesAno", label: ta({ pt: "Mês/ano", en: "Month/year" }), type: "month", required: true, initial: toMonthInput(assistencia?.mesAno) },
    {
      name: "dataDeRetirada",
      label: ta({ pt: "Data de retirada", en: "Pickup date" }),
      type: "date",
      required: true,
      initial: toDateInput(assistencia?.dataDeRetirada),
    },
    { name: "idChamado", label: ta({ pt: "ID do chamado", en: "Ticket ID" }), required: true, initial: assistencia?.idChamado },
    { name: "assistencia", label: ta({ pt: "Assistência", en: "Repair service" }), required: true, initial: assistencia?.assistencia },
    { name: "osDaAssistencia", label: ta({ pt: "OS da assistência", en: "Repair work order" }), required: true, initial: assistencia?.osDaAssistencia },
    {
      name: "statusReparo_id",
      label: ta({ pt: "Status do reparo", en: "Repair status" }),
      type: "select",
      required: creating,
      lookup: statusReparoLookup,
      initial: assistencia?.statusReparo?.id,
    },
    {
      name: "equipamento_id",
      label: ta({ pt: "Equipamento", en: "Equipment" }),
      type: "select",
      required: creating,
      lookup: equipamentoLookup,
      initial: assistencia?.equipamento?.id,
    },
    {
      name: "instituicaoUnidade_id",
      label: ta({ pt: "Instituição/unidade", en: "Institution/unit" }),
      type: "select",
      required: creating,
      lookup: instituicaoLookup,
      initial: assistencia?.instituicaoUnidade?.id,
    },
    {
      name: "tecnico_id",
      label: ta({ pt: "Técnico", en: "Technician" }),
      type: "select",
      required: true,
      lookup: tecnicoLookup,
      initial: assistencia?.tecnico?.id,
    },
    {
      name: "cliente_id",
      label: ta({ pt: "Cliente", en: "Customer" }),
      type: "select",
      required: true,
      lookup: clienteLookup,
      initial: assistencia?.cliente?.id,
    },
    {
      name: "observacoes",
      label: ta({ pt: "Observações", en: "Notes" }),
      type: "textarea",
      placeholder: ta({ pt: "Opcional", en: "Optional" }),
      initial: assistencia?.observacoes,
    },
  ];
}
