import { getT } from "@/i18n/server";
import { FormPage } from "@/components/data/FormPage";
import { getSessionUser } from "@/lib/session";
import { OrdemForm } from "@/features/ordens/OrdemForm";

export const dynamic = "force-dynamic";

export default async function FormularioOrdemdeServicoPage() {
  const user = await getSessionUser();
  const t = await getT();

  return (
    <FormPage title={t({ pt: "Nova ordem de serviço", en: "New work order" })} backHref="/dashboard/tickets" backLabel={t({ pt: "Chamados", en: "Tickets" })} cardTitle={t({ pt: "Dados da OS", en: "Work order details" })}>
      <OrdemForm userId={user?.id ?? ""} />
    </FormPage>
  );
}
