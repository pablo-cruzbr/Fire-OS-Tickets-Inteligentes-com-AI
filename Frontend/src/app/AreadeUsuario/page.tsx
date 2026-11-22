import Link from "next/link";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { api } from "@/services/api";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { loginErrorMessage, setSessionCookie } from "@/lib/auth";
import { AuthDivider, AuthError, AuthShell, authSlides } from "@/components/auth/AuthShell";
import { EmailInput, PasswordInput } from "@/components/auth/AuthFields";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { authLink } from "@/components/auth/authStyles";
import { Field } from "@/components/ui";
import { getT } from "@/i18n/server";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

async function handleLogin(formData: FormData) {
  "use server";

  const parsed = loginSchema.safeParse({
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  });
  if (!parsed.success) {
    redirect(`/AreadeUsuario?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "invalid")}`);
  }

  try {
    const { data } = await api.post("/session", parsed.data);
    if (!data?.token) redirect("/AreadeUsuario?error=credentials");
    await setSessionCookie(data.token);
  } catch (err: any) {
    if (isRedirectError(err)) throw err;
    redirect(err?.response ? "/AreadeUsuario?error=credentials" : "/AreadeUsuario?error=server");
  }

  redirect("/AreadeUsuario/formularioAddTickets");
}

export default async function AreadeUsuario({ searchParams }: PageProps) {
  const { error } = await searchParams;
  const t = await getT();

  return (
    <AuthShell
      eyebrow={t({ pt: "Área do cliente", en: "Customer portal" })}
      title={t({ pt: "Área do usuário", en: "Customer area" })}
      subtitle={t({ pt: "Entre para abrir e acompanhar seus chamados.", en: "Sign in to open and track your tickets." })}
      slides={authSlides.client}
      asideTitle={t({ pt: "Atendimento técnico descomplicado", en: "Technical support made simple" })}
      asideHighlight={t({ pt: "descomplicado", en: "made simple" })}
      asideText={t({ pt: "Abra chamados em poucos cliques e acompanhe cada etapa até a solução.", en: "Open tickets in a few clicks and follow every step until it's solved." })}
      asidePoints={[
        t({ pt: "Abra um chamado em menos de um minuto", en: "Open a ticket in under a minute" }),
        t({ pt: "Seus dados já vão junto com o pedido", en: "Your details go along with the request" }),
        t({ pt: "Técnicos atendendo no seu local", en: "Technicians come to your site" }),
      ]}
      topLink={
        <>
          {t({ pt: "É colaborador?", en: "Staff member?" })}{" "}
          <Link href="/login" className={authLink}>
            {t({ pt: "Portal administrativo", en: "Admin portal" })}
          </Link>
        </>
      }
    >
      <AuthError message={loginErrorMessage(error, t)} />
      <form action={handleLogin} className="flex flex-col gap-5">
        <Field label={t({ pt: "E-mail", en: "Email" })} htmlFor="email">
          <EmailInput id="email" name="email" required />
        </Field>
        <Field label={t({ pt: "Senha", en: "Password" })} htmlFor="password">
          <PasswordInput id="password" name="password" autoComplete="current-password" required minLength={4} />
        </Field>
        <SubmitButton>{t({ pt: "Entrar", en: "Sign in" })}</SubmitButton>
      </form>
      <AuthDivider>{t({ pt: "ou", en: "or" })}</AuthDivider>
      <p className="text-center text-sm leading-relaxed text-bodytext">
        {t({ pt: "Ainda não tem acesso? Peça à empresa que presta o atendimento para criar o seu usuário.", en: "No access yet? Ask the company that services you to create your user." })}
      </p>
    </AuthShell>
  );
}
