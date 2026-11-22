import Link from "next/link";
import { getT } from "@/i18n/server";
import { requireRole } from "@/lib/session";
import { AuthShell, authSlides } from "./AuthShell";
import { authLink } from "./authStyles";
import { NewUserForm, Vinculo } from "./NewUserForm";

/** Register page shared by /signup_empresa and /signup_instituicao (admin only). */
export async function NewUserPage({ vinculo }: { vinculo: Vinculo }) {
  await requireRole("ADMIN");
  const t = await getT();

  return (
    <AuthShell
      eyebrow={t({ pt: "Administração", en: "Administration" })}
      title={t({ pt: "Novo usuário", en: "New user" })}
      subtitle={t({ pt: "Crie o acesso de um cliente à Área do Usuário.", en: "Give a customer access to the Customer Area." })}
      slides={authSlides.signup}
      asidePoints={[
        t({ pt: "Vinculado a uma empresa ou instituição", en: "Linked to a company or institution" }),
        t({ pt: "Setor e dados já preenchidos no chamado", en: "Department and details already filled in on the ticket" }),
        t({ pt: "Acesso imediato à Área do Usuário", en: "Instant access to the Customer Area" }),
      ]}
      asideTitle={t({ pt: "Seus clientes abrindo chamados em minutos", en: "Your customers opening tickets in minutes" })}
      asideHighlight={t({ pt: "em minutos", en: "in minutes" })}
      asideText={t({ pt: "Cada usuário fica vinculado a uma empresa ou instituição e a um setor, e os chamados já chegam identificados.", en: "Each user is linked to a company or institution and a department, so tickets arrive already identified." })}
      footer={
        <>
          {t({ pt: "Mudou de ideia?", en: "Changed your mind?" })}{" "}
          <Link href="/dashboard/usuarios" className={authLink}>
            {t({ pt: "Voltar para a lista de usuários", en: "Back to the user list" })}
          </Link>
        </>
      }
    >
      <NewUserForm defaultVinculo={vinculo} />
    </AuthShell>
  );
}
