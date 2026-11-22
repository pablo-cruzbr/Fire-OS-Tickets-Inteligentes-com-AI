"use client";

import { ta } from "@/i18n/active";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { TbDeviceFloppy } from "react-icons/tb";
import { api } from "@/services/api";
import { apiErrorMessage } from "@/lib/apiError";
import { Button, Field, Select, Textarea } from "@/components/ui";
import { Lookup, useLookups } from "@/components/data/useLookups";
import type { OrdemdeServicoProps } from "@/lib/getOrdemdeServico.type";
import { AtividadesPicker } from "./AtividadesPicker";
import { SearchableSelect } from "./SearchableSelect";

const LOOKUPS: Record<string, Lookup> = {
  prioridade: { endpoint: "/liststatusprioridade" },
  tipo: { endpoint: "/listtipodeordemdeservico" },
  tarefa: { endpoint: "/liststatustarefa" },
  tecnico: { endpoint: "/listtecnico" },
  status: { endpoint: "/liststatusordemdeservico" },
  instituicao: { endpoint: "/listinstuicao" },
  cliente: { endpoint: "/listcliente" },
  equipamento: {
    endpoint: "/listequipamento",
    map: (row) => ({ value: String(row.id), label: `${row.patrimonio ?? "—"} - ${row.name}` }),
  },
};

type FormState = {
  prioridade_id: string;
  tipodeOrdemdeServico_id: string;
  tarefa_id: string;
  tecnico_id: string;
  statusOrdemdeServico_id: string;
  instituicaoUnidade_id: string;
  cliente_id: string;
  equipamento_id: string;
  descricaodoProblemaouSolicitacao: string;
  solucao: string;
};

/** Reads the current ids from the nested relations (falling back to the flat `*_id` columns). */
function initialState(os: OrdemdeServicoProps): FormState {
  const loose = os as OrdemdeServicoProps & Record<string, any>;
  return {
    prioridade_id: os.prioridade?.id ?? loose.prioridade_id ?? "",
    tipodeOrdemdeServico_id: os.tipodeOrdemdeServico?.id ?? os.tipodeOrdemdeServico_id ?? "",
    tarefa_id: os.tarefa?.id ?? loose.tarefa_id ?? "",
    tecnico_id: os.tecnico?.id ?? os.tecnico_id ?? "",
    statusOrdemdeServico_id: os.statusOrdemdeServico?.id ?? os.statusOrdemdeServico_id ?? "",
    instituicaoUnidade_id: os.instituicaoUnidade?.id ?? os.instituicaoUnidade_id ?? "",
    cliente_id: os.cliente?.id ?? os.user?.cliente?.id ?? os.informacoesSetor?.cliente?.id ?? os.cliente_id ?? "",
    equipamento_id: os.equipamento?.id ?? loose.equipamento_id ?? "",
    descricaodoProblemaouSolicitacao: os.descricaodoProblemaouSolicitacao ?? "",
    solucao: os.solucao ?? "",
  };
}

type OrdemEditFormProps = {
  os: OrdemdeServicoProps;
  onSaved: () => void;
  onCancel: () => void;
};

/** "Atribuir técnico / alterar status" — PATCH /ordemdeservico/update/:id. */
export function OrdemEditForm({ os, onSaved, onCancel }: OrdemEditFormProps) {
  const { options, loading, failed } = useLookups(Object.values(LOOKUPS));
  const [form, setForm] = useState<FormState>(() => initialState(os));
  const [existing] = useState(
    () => new Set((os.atividades ?? []).flatMap((item) => (item.atividadePadrao?.id ? [item.atividadePadrao.id] : []))),
  );
  const [novas, setNovas] = useState<Set<string>>(() => new Set());
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  const list = (key: keyof typeof LOOKUPS) => options[LOOKUPS[key].endpoint] ?? [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    // Empty values are left out: the API ignores missing keys, but rejects `null`.
    const payload: Record<string, unknown> = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
      if (form[key]) payload[key] = form[key];
    });
    const adicionadas = Array.from(novas).filter((id) => !existing.has(id));
    if (adicionadas.length > 0) payload.atividades_ids = JSON.stringify(adicionadas);

    setSubmitting(true);
    try {
      await api.patch(`/ordemdeservico/update/${os.id}`, payload);
      toast.success(ta({ pt: "Ordem de serviço atualizada com sucesso!", en: "Work order updated successfully!" }));
      onSaved();
    } catch (error) {
      toast.error(apiErrorMessage(error, ta({ pt: "Erro ao enviar os dados da OS.", en: "Couldn't send the work order data." })));
    } finally {
      setSubmitting(false);
    }
  }

  const nativeSelects: { key: keyof FormState; label: string; lookup: keyof typeof LOOKUPS }[] = [
    { key: "prioridade_id", label: ta({ pt: "Prioridade", en: "Priority" }), lookup: "prioridade" },
    { key: "tipodeOrdemdeServico_id", label: ta({ pt: "Tipo de ordem de serviço", en: "Work order type" }), lookup: "tipo" },
    { key: "tarefa_id", label: ta({ pt: "Tarefa", en: "Task" }), lookup: "tarefa" },
    { key: "tecnico_id", label: ta({ pt: "Técnico", en: "Technician" }), lookup: "tecnico" },
    { key: "statusOrdemdeServico_id", label: ta({ pt: "Status da OS", en: "Work order status" }), lookup: "status" },
  ];

  const searchSelects: { key: keyof FormState; label: string; lookup: keyof typeof LOOKUPS; placeholder: string }[] = [
    { key: "instituicaoUnidade_id", label: ta({ pt: "Instituição / unidade", en: "Institution / unit" }), lookup: "instituicao", placeholder: ta({ pt: "Pesquise a unidade...", en: "Search the unit..." }) },
    { key: "cliente_id", label: ta({ pt: "Cliente", en: "Customer" }), lookup: "cliente", placeholder: ta({ pt: "Selecione o cliente (opcional)", en: "Select the customer (optional)" }) },
    { key: "equipamento_id", label: ta({ pt: "Equipamento", en: "Equipment" }), lookup: "equipamento", placeholder: ta({ pt: "Pesquise por patrimônio ou nome (opcional)", en: "Search by asset tag or name (optional)" }) },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {failed.length > 0 && (
        <p className="rounded-md bg-lightwarning px-4 py-3 text-sm text-warningtext">
          {ta({ pt: "Algumas listas não puderam ser carregadas. Tente reabrir a OS.", en: "Some lists couldn't be loaded. Try reopening the work order." })}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {nativeSelects.map((select) => (
          <Field key={select.key} label={select.label} htmlFor={`os-edit-${select.key}`}>
            <Select
              id={`os-edit-${select.key}`}
              value={form[select.key]}
              disabled={loading}
              onChange={(event) => set(select.key, event.target.value)}
            >
              <option value="">{loading ? ta({ pt: "Carregando...", en: "Loading..." }) : ta({ pt: "Selecione", en: "Select" })}</option>
              {list(select.lookup).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        ))}
        {searchSelects.map((select) => (
          <Field
            key={select.key}
            label={select.label}
            htmlFor={`os-edit-${select.key}`}
            className={select.key === "equipamento_id" ? "md:col-span-2" : undefined}
          >
            <SearchableSelect
              inputId={`os-edit-${select.key}`}
              options={list(select.lookup)}
              loading={loading}
              value={form[select.key]}
              onChange={(value) => set(select.key, value)}
              placeholder={select.placeholder}
            />
          </Field>
        ))}
        <Field label={ta({ pt: "Orientação / descrição do problema", en: "Guidance / problem description" })} htmlFor="os-edit-descricao" className="md:col-span-2">
          <Textarea
            id="os-edit-descricao"
            value={form.descricaodoProblemaouSolicitacao}
            onChange={(event) => set("descricaodoProblemaouSolicitacao", event.target.value)}
            placeholder={ta({ pt: "Descreva o problema ou solicitação...", en: "Describe the problem or request..." })}
          />
        </Field>
        <Field label={ta({ pt: "Solução / procedimento realizado", en: "Solution / procedure performed" })} htmlFor="os-edit-solucao" className="md:col-span-2">
          <Textarea
            id="os-edit-solucao"
            value={form.solucao}
            onChange={(event) => set("solucao", event.target.value)}
            placeholder={ta({ pt: "Descreva a solução aplicada...", en: "Describe the fix applied..." })}
          />
        </Field>
      </div>

      <AtividadesPicker existing={existing} selected={novas} onChange={setNovas} />

      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-5">
        <Button variant="outline" onClick={onCancel} disabled={submitting}>
          {ta({ pt: "Cancelar", en: "Cancel" })}
        </Button>
        <Button type="submit" loading={submitting} disabled={loading} icon={<TbDeviceFloppy className="h-4 w-4" />}>
          {ta({ pt: "Salvar", en: "Save" })}
        </Button>
      </div>
    </form>
  );
}
