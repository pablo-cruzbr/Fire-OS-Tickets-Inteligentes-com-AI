"use client";

import { ta } from "@/i18n/active";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TbDeviceFloppy } from "react-icons/tb";
import { api } from "@/services/api";
import { apiErrorMessage } from "@/lib/apiError";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { useLookups } from "@/components/data/useLookups";
import { SearchableSelect } from "./SearchableSelect";

/** Fixed "Ordem de serviço" tipo (same id the old form sent). */
const ORDER_TYPE_ID = "94e32deb-2a02-41f1-9573-b4b5c265e80a";

const ENDPOINTS = {
  tipodeChamado_id: "/listtipodechamado",
  prioridade_id: "/liststatusprioridade",
  tarefa_id: "/liststatustarefa",
  tecnico_id: "/listtecnico",
  statusOrdemdeServico_id: "/liststatusordemdeservico",
  instituicaoUnidade_id: "/listinstuicao",
  cliente_id: "/listcliente",
} as const;

type SelectKey = keyof typeof ENDPOINTS;

const lookups = Object.values(ENDPOINTS).map((endpoint) => ({ endpoint }));

const emptySelects = Object.fromEntries(Object.keys(ENDPOINTS).map((key) => [key, ""])) as Record<SelectKey, string>;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h6 className="border-b border-border pb-2 text-xs font-semibold uppercase tracking-wide text-muted md:col-span-2">
      {children}
    </h6>
  );
}

/** "Abrir uma OS" — POST /ordemdeservico. */
export function OrdemForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { options, loading, failed } = useLookups(lookups);
  const [selects, setSelects] = useState(emptySelects);
  const [submitting, setSubmitting] = useState(false);

  function select(key: SelectKey, label: string, placeholder = ta({ pt: "Selecione...", en: "Select..." }), className?: string, required?: boolean) {
    return (
      <Field label={label} htmlFor={`os-${key}`} required={required} className={className}>
        <SearchableSelect
          inputId={`os-${key}`}
          options={options[ENDPOINTS[key]] ?? []}
          loading={loading}
          value={selects[key]}
          onChange={(value) => setSelects((previous) => ({ ...previous, [key]: value }))}
          placeholder={placeholder}
          clearable={!required}
        />
      </Field>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const descricaodoProblemaouSolicitacao = formData.get("descricaodoProblemaouSolicitacao")?.toString().trim();
    const contato = formData.get("nomedoContatoaserProcuradonoLocal")?.toString().trim();

    if (!name || !selects.tipodeChamado_id || !descricaodoProblemaouSolicitacao) {
      toast.error(ta({ pt: "Preencha todos os campos obrigatórios.", en: "Fill in all required fields." }));
      return;
    }

    // Kept from the old form (client-side random number). The API ignores it
    // and generates its own numeroOS, retrying on collision.
    const numeroOS = Math.floor(10000 + Math.random() * 90000).toString();

    const payload: Record<string, unknown> = {
      numeroOS,
      name,
      tipodeChamado_id: selects.tipodeChamado_id,
      descricaodoProblemaouSolicitacao,
      tipodeOrdemdeServico_id: ORDER_TYPE_ID,
      nomedoContatoaserProcuradonoLocal: contato || undefined,
      user_id: userId,
    };
    // Optional ids are left out when empty: the API rejects `null`.
    (["prioridade_id", "tarefa_id", "tecnico_id", "statusOrdemdeServico_id", "instituicaoUnidade_id", "cliente_id"] as const).forEach(
      (key) => {
        if (selects[key]) payload[key] = selects[key];
      },
    );

    setSubmitting(true);
    try {
      await api.post("/ordemdeservico", payload);
      toast.success(ta({ pt: "Ordem de serviço cadastrada!", en: "Work order created!" }));
      router.push("/dashboard/tickets");
      router.refresh();
    } catch (error) {
      toast.error(apiErrorMessage(error, ta({ pt: "Erro ao enviar. Verifique os campos e tente novamente.", en: "Couldn't send. Check the fields and try again." })));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {failed.length > 0 && (
        <p className="rounded-md bg-lightwarning px-4 py-3 text-sm text-warningtext">
          {ta({ pt: "Algumas listas não puderam ser carregadas. Tente recarregar a página.", en: "Some lists couldn't be loaded. Try reloading the page." })}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SectionTitle>{ta({ pt: "Informações gerais", en: "General information" })}</SectionTitle>
        <Field label={ta({ pt: "Nome do cliente", en: "Customer name" })} htmlFor="os-name" required>
          <Input id="os-name" name="name" required placeholder={ta({ pt: "Digite o nome do cliente", en: "Type the customer's name" })} />
        </Field>
        {select("tipodeChamado_id", ta({ pt: "Tipo de chamado", en: "Ticket type" }), ta({ pt: "Selecione o tipo de chamado...", en: "Select the ticket type..." }), undefined, true)}
        <Field label={ta({ pt: "Descrição do problema / solicitação", en: "Problem / request description" })} htmlFor="os-descricao" required className="md:col-span-2">
          <Textarea
            id="os-descricao"
            name="descricaodoProblemaouSolicitacao"
            required
            placeholder={ta({ pt: "Descreva o problema ou solicitação...", en: "Describe the problem or request..." })}
          />
        </Field>
        <Field label={ta({ pt: "Nome do contato no local", en: "On-site contact name" })} htmlFor="os-contato" className="md:col-span-2">
          <Input id="os-contato" name="nomedoContatoaserProcuradonoLocal" placeholder={ta({ pt: "Nome do contato (opcional)", en: "Contact name (optional)" })} />
        </Field>

        <SectionTitle>{ta({ pt: "Atribuição", en: "Assignment" })}</SectionTitle>
        {select("prioridade_id", ta({ pt: "Prioridade", en: "Priority" }))}
        {select("tarefa_id", ta({ pt: "Tarefa", en: "Task" }))}
        {select("tecnico_id", ta({ pt: "Técnico", en: "Technician" }))}
        {select("statusOrdemdeServico_id", ta({ pt: "Status da OS", en: "Work order status" }))}

        <SectionTitle>{ta({ pt: "Localização e cliente", en: "Location and customer" })}</SectionTitle>
        {select("instituicaoUnidade_id", ta({ pt: "Instituição / unidade", en: "Institution / unit" }), ta({ pt: "Pesquise e selecione a unidade...", en: "Search and select the unit..." }))}
        {select("cliente_id", ta({ pt: "Cliente", en: "Customer" }), ta({ pt: "Selecione o cliente (opcional)...", en: "Select the customer (optional)..." }))}
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-5">
        <Button variant="outline" onClick={() => router.push("/dashboard/tickets")} disabled={submitting}>
          {ta({ pt: "Cancelar", en: "Cancel" })}
        </Button>
        <Button type="submit" loading={submitting} disabled={loading} icon={<TbDeviceFloppy className="h-4 w-4" />}>
          {ta({ pt: "Concluir", en: "Complete" })}
        </Button>
      </div>
    </form>
  );
}
