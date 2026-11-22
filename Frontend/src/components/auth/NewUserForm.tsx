"use client";

import { ta } from "@/i18n/active";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TbBuildingCommunity, TbBuildingStore } from "react-icons/tb";
import { api } from "@/services/api";
import { apiErrorMessage } from "@/lib/apiError";
import { useT } from "@/i18n/text";
import { cn } from "@/lib/cn";
import { useLookups } from "@/components/data/useLookups";
import { Field } from "@/components/ui";
import { AuthInput, AuthSelect, EmailInput, PasswordInput } from "./AuthFields";
import { AuthButton } from "./SubmitButton";

export type Vinculo = "empresa" | "instituicao";

const lookups = {
  empresa: { endpoint: "/listcliente" },
  instituicao: { endpoint: "/listinstuicao" },
  setor: { endpoint: "/listsetores" },
};

/**
 * Registers a user linked either to a private client (empresa) or to a
 * municipal institution — the two old signup pages merged into one form.
 */
export function NewUserForm({ defaultVinculo }: { defaultVinculo: Vinculo }) {
  const t = useT();
  const router = useRouter();
  const [vinculo, setVinculo] = useState<Vinculo>(defaultVinculo);
  const [sending, setSending] = useState(false);
  const { options, loading, failed } = useLookups([lookups.empresa, lookups.instituicao, lookups.setor]);

  const orgOptions = options[lookups[vinculo].endpoint] ?? [];
  const setorOptions = options[lookups.setor.endpoint] ?? [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const org = form.get("org")?.toString() ?? "";

    setSending(true);
    try {
      await api.post("/users", {
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        ...(vinculo === "empresa" ? { cliente_id: org } : { instituicaoUnidade_id: org }),
        setor_id: form.get("setor"),
      });
      toast.success(t({ pt: "Usuário cadastrado com sucesso!", en: "User created successfully!" }));
      if (form.get("another")) {
        formElement.reset();
      } else {
        router.push("/dashboard/usuarios");
      }
    } catch (error) {
      toast.error(apiErrorMessage(error, t({ pt: "Erro ao cadastrar usuário.", en: "Couldn't create the user." })));
    } finally {
      setSending(false);
    }
  }

  const tabs: { key: Vinculo; label: string; icon: React.ReactNode }[] = [
    { key: "empresa", label: t({ pt: "Empresa", en: "Company" }), icon: <TbBuildingStore /> },
    { key: "instituicao", label: t({ pt: "Instituição", en: "Institution" }), icon: <TbBuildingCommunity /> },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div role="radiogroup" aria-label={t({ pt: "Vínculo do usuário", en: "User belongs to" })} className="grid grid-cols-2 gap-1 rounded-btn border border-border bg-fill-1 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="radio"
            aria-checked={vinculo === tab.key}
            onClick={() => setVinculo(tab.key)}
            className={cn(
              "flex h-10 items-center justify-center gap-2 rounded-[6px] text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-periwinkle",
              vinculo === tab.key
                ? "border border-border-accent bg-card text-primarytext shadow-[0_4px_16px_-8px_rgba(21,48,234,0.35)] dark:bg-lightprimary dark:text-white"
                : "border border-transparent text-bodytext hover:text-link",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {failed.length > 0 && (
        <p className="rounded-btn border border-warning/25 bg-lightwarning px-4 py-3 text-sm text-warningtext">
          {t({ pt: "Não foi possível carregar algumas listas. Verifique se você está logado como administrador.", en: "Some lists couldn't be loaded. Make sure you're signed in as an admin." })}
        </p>
      )}

      <Field label={t({ pt: "Nome completo", en: "Full name" })} htmlFor="name" required>
        <AuthInput id="name" name="name" autoComplete="name" required />
      </Field>
      <Field label={ta({ pt: "E-mail", en: "Email" })} htmlFor="email" required>
        <EmailInput id="email" name="email" required />
      </Field>
      <Field label={t({ pt: "Senha", en: "Password" })} htmlFor="password" required hint={t({ pt: "Mínimo de 4 caracteres.", en: "At least 4 characters." })}>
        <PasswordInput id="password" name="password" autoComplete="new-password" minLength={4} required />
      </Field>
      <Field label={vinculo === "empresa" ? t({ pt: "Empresa", en: "Company" }) : t({ pt: "Instituição", en: "Institution" })} htmlFor="org" required>
        <AuthSelect id="org" name="org" required defaultValue="" key={vinculo} disabled={loading}>
          <option value="" disabled>
            {loading ? t({ pt: "Carregando...", en: "Loading..." }) : t({ pt: "Selecione", en: "Select" })}
          </option>
          {orgOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </AuthSelect>
      </Field>
      <Field label={t({ pt: "Setor", en: "Department" })} htmlFor="setor" required>
        <AuthSelect id="setor" name="setor" required defaultValue="" disabled={loading}>
          <option value="" disabled>
            {loading ? t({ pt: "Carregando...", en: "Loading..." }) : t({ pt: "Selecione", en: "Select" })}
          </option>
          {setorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </AuthSelect>
      </Field>

      <label className="flex items-center gap-2 text-sm text-bodytext">
        <input type="checkbox" name="another" className="h-4 w-4 rounded accent-[var(--primary)]" />
        {t({ pt: "Cadastrar outro em seguida", en: "Add another one next" })}
      </label>

      <AuthButton loading={sending} disabled={loading}>
        {t({ pt: "Cadastrar usuário", en: "Create user" })}
      </AuthButton>
    </form>
  );
}
