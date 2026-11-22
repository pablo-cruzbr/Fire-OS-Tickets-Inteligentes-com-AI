"use client";

import { ta } from "@/i18n/active";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TbCircleCheck,
  TbClockPause,
  TbExternalLink,
  TbFileSpreadsheet,
  TbListDetails,
  TbPlayerPlay,
  TbTicket,
} from "react-icons/tb";
import { CellTitle, EntityList, optionsFrom } from "@/components/data/EntityList";
import { Button, ButtonLink, StatusBadge } from "@/components/ui";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { OrdemdeServicoProps, OrdemdeServicoResponseData } from "@/lib/getOrdemdeServico.type";
import { ExportOrdensModal } from "./ExportOrdensModal";
import { RelatorioSecretariaModal, type Secretaria } from "./RelatorioSecretariaModal";
import { byNewest, osClienteName, osInstituicaoName, osPlaceName } from "./helpers";

const REFRESH_INTERVAL = 60_000;

/** Silent refresh every 60s and whenever the window regains focus. */
function useAutoRefresh() {
  const router = useRouter();
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    window.addEventListener("focus", refresh);
    const interval = window.setInterval(refresh, REFRESH_INTERVAL);
    return () => {
      window.removeEventListener("focus", refresh);
      window.clearInterval(interval);
    };
  }, [router]);
}

/** Matches when any of the candidate names equals the selected filter value. */
function anyIs(value: string, ...names: (string | null | undefined)[]) {
  return names.some((name) => name === value);
}

export default function OrdensList({ data }: { data: OrdemdeServicoResponseData }) {
  const { openModal } = useGlobalModal();
  const [exportOpen, setExportOpen] = useState(false);
  const [secretaria, setSecretaria] = useState<Secretaria | null>(null);
  useAutoRefresh();

  const items = useMemo(() => [...(data.controles ?? [])].sort(byNewest), [data.controles]);

  return (
    <>
      <EntityList<OrdemdeServicoProps>
        title={ta({ pt: "Chamados", en: "Tickets" })}
        breadcrumbs={[{ label: ta({ pt: "Chamados", en: "Tickets" }) }, { label: ta({ pt: "Lista de chamados", en: "Ticket list" }) }]}
        description={ta({
        pt: `${data.total ?? items.length} chamados no total, do mais recente para o mais antigo.`,
        en: `${data.total ?? items.length} tickets in total, newest first.`,
      })}
        items={items}
        rowKey={(os) => os.id}
        stats={[
          { label: ta({ pt: "Abertas", en: "Open" }), value: data.totalAberta ?? 0, tone: "warning", icon: <TbTicket /> },
          { label: ta({ pt: "Em andamento", en: "In progress" }), value: data.totalEmAndamento ?? 0, tone: "primary", icon: <TbPlayerPlay /> },
          { label: ta({ pt: "Pausadas", en: "Paused" }), value: data.totalPausada ?? 0, tone: "secondary", icon: <TbClockPause /> },
          { label: ta({ pt: "Concluídas", en: "Completed" }), value: data.totalConcluida ?? 0, tone: "success", icon: <TbCircleCheck /> },
        ]}
        search={{
          placeholder: ta({ pt: "Buscar por nº da OS, solicitante ou local...", en: "Search by work order no., requester or location..." }),
          text: (os) => [os.numeroOS?.toString(), os.name, osPlaceName(os)],
        }}
        filters={[
          {
            label: ta({ pt: "Status", en: "Status" }),
            options: (rows) => optionsFrom(rows, (os) => os.statusOrdemdeServico?.name),
            match: (os, value) => os.statusOrdemdeServico?.name === value,
          },
          {
            label: ta({ pt: "Tipo", en: "Type" }),
            options: (rows) => optionsFrom(rows, (os) => os.tipodeOrdemdeServico?.name),
            match: (os, value) => os.tipodeOrdemdeServico?.name === value,
          },
          {
            label: ta({ pt: "Prioridade", en: "Priority" }),
            options: (rows) => optionsFrom(rows, (os) => os.prioridade?.name),
            match: (os, value) => os.prioridade?.name === value,
          },
          {
            label: ta({ pt: "Tarefa", en: "Task" }),
            options: (rows) => optionsFrom(rows, (os) => os.tarefa?.name),
            match: (os, value) => os.tarefa?.name === value,
          },
          {
            label: ta({ pt: "Técnico", en: "Technician" }),
            options: (rows) => optionsFrom(rows, (os) => os.tecnico?.name),
            match: (os, value) => os.tecnico?.name === value,
          },
          {
            label: ta({ pt: "Instituição", en: "Institution" }),
            options: (rows) => optionsFrom(rows, osInstituicaoName),
            match: (os, value) =>
              anyIs(
                value,
                os.instituicaoUnidade?.name,
                os.user?.instituicaoUnidade?.name,
                os.informacoesSetor?.instituicaoUnidade?.name,
              ),
          },
          {
            label: ta({ pt: "Cliente", en: "Customer" }),
            options: (rows) => optionsFrom(rows, osClienteName),
            match: (os, value) =>
              anyIs(value, os.cliente?.name, os.user?.cliente?.name, os.informacoesSetor?.cliente?.name),
          },
        ]}
        columns={[
          {
            header: ta({ pt: "Nº da OS", en: "Work order no." }),
            cell: (os) => (
              <CellTitle title={os.numeroOS ? `#${os.numeroOS}` : "—"} subtitle={os.tipodeOrdemdeServico?.name} />
            ),
          },
          {
            header: ta({ pt: "Solicitante", en: "Requester" }),
            cell: (os) => <CellTitle title={os.name || "—"} subtitle={osPlaceName(os)} />,
          },
          { header: ta({ pt: "Status", en: "Status" }), cell: (os) => <StatusBadge status={os.statusOrdemdeServico?.name} /> },
          { header: ta({ pt: "Prioridade", en: "Priority" }), cell: (os) => <StatusBadge status={os.prioridade?.name} /> },
          { header: ta({ pt: "Técnico", en: "Technician" }), cell: (os) => os.tecnico?.name ?? <span className="text-muted">{ta({ pt: "Não atribuído", en: "Unassigned" })}</span> },
          { header: ta({ pt: "Aberta em", en: "Opened on" }), cell: (os) => formatDateTime(os.created_at), className: "whitespace-nowrap" },
          {
            header: ta({ pt: "Página", en: "Page" }),
            className: "w-16 text-right",
            cell: (os) => (
              <Link
                href={`/dashboard/ordemdeservico/${os.id}`}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                aria-label={ta({ pt: `Abrir a página da OS ${os.numeroOS ?? ""}`, en: `Open the page of work order ${os.numeroOS ?? ""}` })}
                title={ta({ pt: "Abrir a página da OS", en: "Open the work order page" })}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-bodytext transition-colors hover:bg-lightprimary hover:text-primarytext"
              >
                <TbExternalLink className="h-4 w-4" />
              </Link>
            ),
          },
        ]}
        headerActions={
          <>
            <Button
              variant="surface"
              onClick={() => setExportOpen(true)}
              icon={<TbFileSpreadsheet className="h-4 w-4" />}
            >
              {ta({ pt: "Relatório", en: "Report" })}
            </Button>
            <Button
              variant="surface"
              onClick={() => setSecretaria("educacao")}
              icon={<TbFileSpreadsheet className="h-4 w-4" />}
              title={ta({ pt: "Relatório da Secretaria da Educação", en: "Department of Education report" })}
            >
              {ta({ pt: "Rel. Educação", en: "Education rpt." })}
            </Button>
            <Button
              variant="surface"
              onClick={() => setSecretaria("saude")}
              icon={<TbFileSpreadsheet className="h-4 w-4" />}
              title={ta({ pt: "Relatório da Secretaria da Saúde", en: "Department of Health report" })}
            >
              {ta({ pt: "Rel. Saúde", en: "Health rpt." })}
            </Button>
            <ButtonLink
              href="/dashboard/formulariosadd/formularioOrdemdeServico"
              variant="light"
              icon={<TbListDetails className="h-4 w-4" />}
            >
              {ta({ pt: "Nova OS", en: "New work order" })}
            </ButtonLink>
          </>
        }
        add={{ href: "/dashboard/formulariosadd/formularioTicket", label: ta({ pt: "Novo ticket", en: "New ticket" }) }}
        onOpen={(os) => openModal("OrdemdeServico", os)}
        emptyMessage={ta({ pt: "Nenhum chamado cadastrado ainda.", en: "No tickets yet." })}
      />

      {exportOpen && <ExportOrdensModal onClose={() => setExportOpen(false)} />}
      {secretaria && <RelatorioSecretariaModal secretaria={secretaria} onClose={() => setSecretaria(null)} />}
    </>
  );
}
