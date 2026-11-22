import { getT } from "@/i18n/server";
import { FormPage } from "@/components/data/FormPage";
import { getSessionUser } from "@/lib/session";
import { TicketForm } from "@/features/ordens/TicketForm";

export const dynamic = "force-dynamic";

export default async function FormularioTicketPage() {
  const user = await getSessionUser();
  const t = await getT();

  return (
    <FormPage
      title={t({ pt: "Novo ticket", en: "New ticket" })}
      backHref="/dashboard/tickets"
      backLabel={t({ pt: "Chamados", en: "Tickets" })}
      cardTitle={t({ pt: "Dados do ticket", en: "Ticket details" })}
      description={t({ pt: "Pesquise o usuário pelo nome ou ramal e registre o atendimento.", en: "Look up the user by name or extension and log the request." })}
    >
      <TicketForm userId={user?.id ?? ""} />
    </FormPage>
  );
}
