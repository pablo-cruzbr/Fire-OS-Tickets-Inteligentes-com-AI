import { useT } from "@/i18n/text";
import { TbCircleCheck, TbPlus } from "react-icons/tb";
import { UserPortalShell } from "@/components/auth/UserPortalShell";
import { ButtonLink, Card } from "@/components/ui";

export default function FormularioEnviado() {
  const t = useT();
  return (
    <UserPortalShell>
      <Card className="mx-auto max-w-lg py-12 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-success/25 bg-lightsuccess text-3xl text-successtext shadow-[0_0_40px_-8px_var(--success)]">
          <TbCircleCheck />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-link">{t({ pt: "Chamado enviado!", en: "Ticket sent!" })}</h1>
        <p className="mx-auto mt-2 max-w-sm text-bodytext">
          {t({ pt: "Recebemos sua solicitação e em breve entraremos em contato para o atendimento. Obrigado!", en: "We received your request and will get in touch soon to schedule the service. Thank you!" })}
        </p>
        <ButtonLink href="/AreadeUsuario/formularioAddTickets" className="mt-8" icon={<TbPlus className="h-4 w-4" />}>
          {t({ pt: "Abrir outro chamado", en: "Open another ticket" })}
        </ButtonLink>
      </Card>
    </UserPortalShell>
  );
}
