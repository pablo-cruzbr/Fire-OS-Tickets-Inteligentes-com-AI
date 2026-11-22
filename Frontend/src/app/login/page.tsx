import Link from "next/link";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { api } from "@/services/api";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { loginErrorMessage, setSessionCookie } from "@/lib/auth";
import { AuthDivider, AuthError, AuthShell, authSlides } from "@/components/auth/AuthShell";
import { EmailInput, PasswordInput } from "@/components/auth/AuthFields";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { authButton, authLink } from "@/components/auth/authStyles";
import { Field } from "@/components/ui";
import { getT } from "@/i18n/server";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

async function handleLogin(formData: FormData) {
  "use server";

  const parsed = loginSchema.safeParse({
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  });
  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "invalid")}`);
  }

  try {
    const { data } = await api.post("/session", parsed.data);
    if (!data?.token) redirect("/login?error=credentials");

    const role = data.role?.toUpperCase() ?? "USER";
    if (role === "USER") redirect("/login?error=no_admin");

    await setSessionCookie(data.token);
    redirect(role === "ADMIN" ? "/dashboard" : "/dashboard/tickets");
  } catch (err: any) {
    if (isRedirectError(err)) throw err;
    redirect(err?.response ? "/login?error=credentials" : "/login?error=server");
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const t = await getT();

  return (
    <AuthShell
      eyebrow={t({ pt: "Portal administrativo", en: "Admin portal" })}
      title={t({ pt: "Bem-vindo de volta", en: "Welcome back" })}
      subtitle={t({ pt: "Portal administrativo para administradores e técnicos.", en: "Admin portal for administrators and technicians." })}
      slides={authSlides.staff}
      asideTitle={t({ pt: "Sua equipe em campo, organizada do chamado à OS assinada", en: "Your field team, organized from ticket to signed work order" })}
      asideHighlight={t({ pt: "do chamado à OS assinada", en: "from ticket to signed work order" })}
      asideText={t({ pt: "Agende atendimentos, acompanhe cada ordem de serviço e tenha o histórico de todos os equipamentos.", en: "Schedule jobs, track every work order and keep the history of all your equipment." })}
      topLink={
        <>
          {t({ pt: "É cliente?", en: "Are you a customer?" })}{" "}
          <Link href="/AreadeUsuario" className={authLink}>
            {t({ pt: "Área do usuário", en: "Customer area" })}
          </Link>
        </>
      }
    >
      <AuthError message={loginErrorMessage(error, t)} />
      <form action={handleLogin} className="flex flex-col gap-5">
        <Field label="E-mail" htmlFor="email">
          <EmailInput id="email" name="email" required />
        </Field>
        <Field label={t({ pt: "Senha", en: "Password" })} htmlFor="password">
          <PasswordInput id="password" name="password" autoComplete="current-password" required minLength={4} />
        </Field>
        <SubmitButton>{t({ pt: "Entrar", en: "Sign in" })}</SubmitButton>
      </form>
      <AuthDivider>{t({ pt: "ou", en: "or" })}</AuthDivider>
      <Link href="/AreadeUsuario" className={authButton.secondary}>
        {t({ pt: "Sou cliente, quero abrir um chamado", en: "I'm a customer, I want to open a ticket" })}
      </Link>
    </AuthShell>
  );
}
