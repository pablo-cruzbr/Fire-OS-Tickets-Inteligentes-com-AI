import Link from "next/link";
import { requireRole } from "@/lib/session";
import { AuthShell, authSlides } from "./AuthShell";
import { authLink } from "./authStyles";
import { NewUserForm, Vinculo } from "./NewUserForm";

/** Register page shared by /signup_empresa and /signup_instituicao (admin only). */
export async function NewUserPage({ vinculo }: { vinculo: Vinculo }) {
  await requireRole("ADMIN");

  return (
    <AuthShell
      eyebrow="Administração"
      title="Novo usuário"
      subtitle="Crie o acesso de um cliente à Área do Usuário."
      slides={authSlides.signup}
      asidePoints={["Vinculado a uma empresa ou instituição", "Setor e dados já preenchidos no chamado", "Acesso imediato à Área do Usuário"]}
      asideTitle="Seus clientes abrindo chamados em minutos"
      asideHighlight="em minutos"
      asideText="Cada usuário fica vinculado a uma empresa ou instituição e a um setor, e os chamados já chegam identificados."
      footer={
        <>
          Mudou de ideia?{" "}
          <Link href="/dashboard/usuarios" className={authLink}>
            Voltar para a lista de usuários
          </Link>
        </>
      }
    >
      <NewUserForm defaultVinculo={vinculo} />
    </AuthShell>
  );
}
