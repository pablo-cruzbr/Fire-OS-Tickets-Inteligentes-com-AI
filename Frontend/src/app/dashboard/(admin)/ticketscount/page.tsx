import { getT } from "@/i18n/server";
import { TbListDetails } from "react-icons/tb";
import { ButtonLink, PageHeader } from "@/components/ui";
import { serverGet } from "@/lib/serverApi";
import { TechCalendar } from "@/features/calendario/TechCalendar";
import type { OrdemdeServicoResponseData } from "@/lib/getOrdemdeServico.type";

export const dynamic = "force-dynamic";

export default async function CalendarioTecnicoPage() {
  const t = await getT();
  const title = t({ pt: "Calendário técnico", en: "Technician calendar" });
  const data = await serverGet<Partial<OrdemdeServicoResponseData>>("/listordemdeservico", { controles: [] });

  return (
    <section>
      <PageHeader
        title={title}
        breadcrumbs={[{ label: t({ pt: "Administração", en: "Administration" }) }, { label: title }]}
        actions={
          <ButtonLink href="/dashboard/tickets" variant="surface" icon={<TbListDetails className="h-4 w-4" />}>
            {t({ pt: "Lista de chamados", en: "Ticket list" })}
          </ButtonLink>
        }
      />
      <TechCalendar ordens={data.controles ?? []} />
    </section>
  );
}
