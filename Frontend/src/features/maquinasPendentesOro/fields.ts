import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import { fromDateInput, toDateInput } from "@/lib/format";
import type { MaquinasPendentesOroProps } from "@/lib/getMaquinasPendentesOro.type";
import { equipamentoLookup, instituicaoLookup } from "@/features/equipamentos/fields";

const statusLookup = { endpoint: "/liststatusMaquinasPendentesOro" };

/** Same payload keys on create (POST) and edit (PATCH). */
export function maquinaPendenteOroFields(maquina?: MaquinasPendentesOroProps): FormField[] {
  const editing = Boolean(maquina);
  return [
    {
      name: "equipamento_id",
      label: ta({ pt: "Equipamento", en: "Equipment" }),
      type: "select",
      required: !editing,
      lookup: equipamentoLookup,
      placeholder: ta({ pt: "Selecione o equipamento", en: "Select the equipment" }),
      initial: maquina?.equipamento?.id ?? "",
      full: true,
    },
    {
      name: "datadaInstalacao",
      label: ta({ pt: "Data da instalação", en: "Installation date" }),
      type: "date",
      required: !editing,
      initial: toDateInput(maquina?.datadaInstalacao),
      // On edit an empty date is left out: the API coerces null to 01/01/1970.
      serialize: editing ? (raw) => (raw ? fromDateInput(raw) : undefined) : undefined,
    },
    {
      name: "statusMaquinasPendentesOro_id",
      label: ta({ pt: "Status", en: "Status" }),
      type: "select",
      required: !editing,
      lookup: statusLookup,
      placeholder: ta({ pt: "Selecione o status", en: "Select the status" }),
      initial: maquina?.statusMaquinasPendentesOro?.id ?? "",
    },
    {
      name: "osInstalacao",
      label: ta({ pt: "OS de instalação", en: "Installation work order" }),
      required: true,
      placeholder: ta({ pt: "OS de instalação", en: "Installation work order" }),
      initial: maquina?.osInstalacao,
    },
    {
      name: "osRetirada",
      label: ta({ pt: "OS de retirada", en: "Pickup work order" }),
      required: true,
      placeholder: ta({ pt: "OS de retirada", en: "Pickup work order" }),
      initial: maquina?.osRetirada,
    },
    {
      name: "instituicaoUnidade_id",
      label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }),
      type: "select",
      required: !editing,
      lookup: instituicaoLookup,
      placeholder: ta({ pt: "Selecione a instituição", en: "Select the institution" }),
      initial: maquina?.instituicaoUnidade?.id ?? "",
      full: true,
    },
  ];
}
