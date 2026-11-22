"use client";

import { ta } from "@/i18n/active";
import { useState } from "react";
import { TbFileSpreadsheet } from "react-icons/tb";
import { Button, Field, Input, Modal } from "@/components/ui";
import { useLookups } from "@/components/data/useLookups";
import { exportOrdemServicoExcel } from "@/lib/exportExcel";
import { SearchableSelect } from "./SearchableSelect";

const lookups = [
  { endpoint: "/liststatustarefa" },
  { endpoint: "/listinstuicao" },
  { endpoint: "/listcliente" },
  { endpoint: "/liststatusordemdeservico" },
  { endpoint: "/listtipodeordemdeservico" },
];

const empty = {
  startDate: "",
  endDate: "",
  tarefa_id: "",
  instituicao_id: "",
  cliente_id: "",
  status_id: "",
  tipoOS_id: "",
};

/**
 * "Gerar relatório de OS" (Excel). Keeps its own filter state — it used to
 * share tarefa/instituição/cliente with the list filters.
 */
export function ExportOrdensModal({ onClose }: { onClose: () => void }) {
  const { options, loading } = useLookups(lookups);
  const [filters, setFilters] = useState(empty);
  const [exporting, setExporting] = useState(false);

  function set(key: keyof typeof empty, value: string) {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }

  async function handleExport() {
    if (exporting) return;
    setExporting(true);
    const params = Object.fromEntries(Object.entries(filters).map(([key, value]) => [key, value || undefined]));
    await exportOrdemServicoExcel(params);
    setExporting(false);
  }

  const selects: { key: keyof typeof empty; label: string; endpoint: string; placeholder: string }[] = [
    { key: "tarefa_id", label: ta({ pt: "Tarefa", en: "Task" }), endpoint: "/liststatustarefa", placeholder: ta({ pt: "Todas as tarefas", en: "All tasks" }) },
    { key: "instituicao_id", label: ta({ pt: "Instituição", en: "Institution" }), endpoint: "/listinstuicao", placeholder: ta({ pt: "Todas as instituições", en: "All institutions" }) },
    { key: "cliente_id", label: ta({ pt: "Cliente", en: "Customer" }), endpoint: "/listcliente", placeholder: ta({ pt: "Todos os clientes", en: "All customers" }) },
    { key: "status_id", label: ta({ pt: "Status", en: "Status" }), endpoint: "/liststatusordemdeservico", placeholder: ta({ pt: "Todos os status", en: "All statuses" }) },
    { key: "tipoOS_id", label: ta({ pt: "Tipo de OS", en: "Work order type" }), endpoint: "/listtipodeordemdeservico", placeholder: ta({ pt: "Todos os tipos", en: "All types" }) },
  ];

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={ta({ pt: "Gerar relatório de OS", en: "Generate work order report" })}
      subtitle={ta({ pt: "Exporta as ordens de serviço filtradas para Excel.", en: "Exports the filtered work orders to Excel." })}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={exporting}>
            {ta({ pt: "Cancelar", en: "Cancel" })}
          </Button>
          <Button onClick={handleExport} loading={exporting} icon={<TbFileSpreadsheet className="h-4 w-4" />}>
            {exporting ? ta({ pt: "Processando...", en: "Processing..." }) : ta({ pt: "Exportar Excel", en: "Export to Excel" })}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={ta({ pt: "Início", en: "Start" })} htmlFor="export-start">
          <Input id="export-start" type="date" value={filters.startDate} onChange={(e) => set("startDate", e.target.value)} />
        </Field>
        <Field label={ta({ pt: "Fim", en: "End" })} htmlFor="export-end">
          <Input id="export-end" type="date" value={filters.endDate} onChange={(e) => set("endDate", e.target.value)} />
        </Field>
        {selects.map((select) => (
          <Field
            key={select.key}
            label={select.label}
            htmlFor={`export-${select.key}`}
            className={select.key === "tipoOS_id" ? "sm:col-span-2" : undefined}
          >
            <SearchableSelect
              inputId={`export-${select.key}`}
              options={options[select.endpoint] ?? []}
              loading={loading}
              value={filters[select.key]}
              onChange={(value) => set(select.key, value)}
              placeholder={select.placeholder}
            />
          </Field>
        ))}
      </div>
    </Modal>
  );
}
