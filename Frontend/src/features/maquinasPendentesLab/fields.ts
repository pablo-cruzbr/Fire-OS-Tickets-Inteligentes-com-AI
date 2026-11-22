import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import type { MaquinasPendentesLabProps } from "@/lib/getMaquinasPendentesLab.type";
import { equipamentoLookup, instituicaoLookup } from "@/features/equipamentos/fields";

const statusLookup = { endpoint: "/liststatusMaquinasPendentesLab" };

/** Same payload keys on create (POST) and edit (PATCH). */
export function maquinaPendenteLabFields(maquina?: MaquinasPendentesLabProps): FormField[] {
  return [
    {
      name: "equipamento_id",
      label: ta({ pt: "Equipamento", en: "Equipment" }),
      type: "select",
      required: true,
      lookup: equipamentoLookup,
      placeholder: ta({ pt: "Selecione o equipamento", en: "Select the equipment" }),
      initial: maquina?.equipamento?.id ?? "",
      full: true,
    },
    {
      name: "numeroDeSerie",
      label: ta({ pt: "Número de série", en: "Serial number" }),
      required: true,
      placeholder: ta({ pt: "Número de série", en: "Serial number" }),
      initial: maquina?.numeroDeSerie,
    },
    { name: "ssd", label: ta({ pt: "SSD", en: "SSD" }), required: true, placeholder: ta({ pt: "Possui SSD? (Sim/Não)", en: "Has an SSD? (Yes/No)" }), initial: maquina?.ssd },
    { name: "idDaOs", label: ta({ pt: "ID da OS", en: "Work order ID" }), required: true, placeholder: ta({ pt: "ID da OS", en: "Work order ID" }), initial: maquina?.idDaOs },
    {
      name: "statusMaquinasPendentesLab_id",
      label: ta({ pt: "Status", en: "Status" }),
      type: "select",
      required: true,
      lookup: statusLookup,
      placeholder: ta({ pt: "Selecione o status", en: "Select the status" }),
      initial: maquina?.statusMaquinasPendentesLab?.id ?? "",
    },
    {
      name: "instituicaoUnidade_id",
      label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }),
      type: "select",
      required: true,
      lookup: instituicaoLookup,
      placeholder: ta({ pt: "Selecione a instituição", en: "Select the institution" }),
      initial: maquina?.instituicaoUnidade?.id ?? "",
      full: true,
    },
    {
      name: "obs",
      label: ta({ pt: "Observações", en: "Notes" }),
      type: "textarea",
      required: !maquina,
      placeholder: ta({ pt: "Observações", en: "Notes" }),
      initial: maquina?.obs,
    },
  ];
}
