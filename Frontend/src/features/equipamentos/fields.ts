import { ta } from "@/i18n/active";
import type { FormField } from "@/components/data/EntityForm";
import type { Lookup } from "@/components/data/useLookups";
import type { EquipamentoProps } from "@/lib/getEquipamento.type";

/** Equipment options shown as "patrimônio - nome" (also used by the pendentes forms). */
export const equipamentoLookup: Lookup = {
  endpoint: "/listequipamento",
  map: (row) => ({ value: String(row.id), label: `${row.patrimonio ?? "—"} - ${row.name ?? ""}` }),
};

export const instituicaoLookup: Lookup = { endpoint: "/listinstuicao" };

const tipoLookup: Lookup = {
  endpoint: "/list/tipo/equipamento",
  unwrap: (data) => (Array.isArray(data) ? data : Array.isArray(data?.tipos) ? data.tipos : []),
};

/**
 * Create sends `{ name, patrimonio, instituicaoUnidade_id }`; edit also sends
 * `tipodeEquipamento_id`.
 */
export function equipamentoFields(equipamento?: EquipamentoProps): FormField[] {
  const fields: FormField[] = [
    {
      name: "name",
      label: ta({ pt: "Nome do equipamento", en: "Equipment name" }),
      required: true,
      placeholder: ta({ pt: "Ex.: Notebook Dell Latitude", en: "E.g. Dell Latitude laptop" }),
      initial: equipamento?.name,
    },
    {
      name: "patrimonio",
      label: ta({ pt: "Patrimônio", en: "Asset tag" }),
      required: true,
      placeholder: ta({ pt: "Número do patrimônio", en: "Asset tag number" }),
      initial: equipamento?.patrimonio,
    },
    {
      name: "instituicaoUnidade_id",
      label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }),
      type: "select",
      required: !equipamento,
      lookup: instituicaoLookup,
      placeholder: ta({ pt: "Selecione a unidade", en: "Select the unit" }),
      initial: equipamento?.instituicaoUnidade?.id ?? "",
    },
  ];

  if (equipamento) {
    fields.push({
      name: "tipodeEquipamento_id",
      label: ta({ pt: "Tipo do equipamento", en: "Equipment type" }),
      type: "select",
      lookup: tipoLookup,
      placeholder: ta({ pt: "Selecione o tipo", en: "Select the type" }),
      initial: equipamento.tipodeEquipamento?.id ?? "",
    });
  }

  return fields;
}
