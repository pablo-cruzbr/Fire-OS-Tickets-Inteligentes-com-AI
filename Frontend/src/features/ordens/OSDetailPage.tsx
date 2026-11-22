"use client";

import { ta } from "@/i18n/active";
import { TbFileText, TbPrinter } from "react-icons/tb";
import { Button, ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
import type { OrdemdeServicoProps } from "@/lib/getOrdemdeServico.type";
import { OSDocument } from "./OSDocument";
import type { Foto } from "./helpers";

/** /dashboard/ordemdeservico/[id]: the printable OS inside the dashboard. */
export function OSDetailPage({ os, fotos }: { os: OrdemdeServicoProps | null; fotos: Foto[] }) {
  if (!os) {
    return (
      <section>
        <PageHeader title={ta({ pt: "Ordem de serviço", en: "Work order" })} breadcrumbs={[{ label: ta({ pt: "Chamados", en: "Tickets" }), href: "/dashboard/tickets" }, { label: ta({ pt: "OS", en: "WO" }) }]} />
        <Card>
          <EmptyState
            title={ta({ pt: "Ordem de serviço não encontrada", en: "Work order not found" })}
            action={<ButtonLink href="/dashboard/tickets">{ta({ pt: "Voltar aos chamados", en: "Back to tickets" })}</ButtonLink>}
          />
        </Card>
      </section>
    );
  }

  return (
    <section>
      <div className="print:hidden">
        <PageHeader
          title={ta({ pt: `OS #${os.numeroOS ?? "—"}`, en: `WO #${os.numeroOS ?? "—"}` })}
          breadcrumbs={[{ label: ta({ pt: "Chamados", en: "Tickets" }), href: "/dashboard/tickets" }, { label: ta({ pt: `OS #${os.numeroOS ?? "—"}`, en: `WO #${os.numeroOS ?? "—"}` }) }]}
          actions={
            <>
              <ButtonLink
                href={`/os-digital/${os.id}`}
                target="_blank"
                variant="surface"
                icon={<TbFileText className="h-4 w-4" />}
              >
                {ta({ pt: "OS digital", en: "Digital work order" })}
              </ButtonLink>
              <Button onClick={() => window.print()} icon={<TbPrinter className="h-4 w-4" />}>
                {ta({ pt: "Imprimir / salvar PDF", en: "Print / save as PDF" })}
              </Button>
            </>
          }
        />
      </div>
      <OSDocument os={os} fotos={fotos} />
    </section>
  );
}
