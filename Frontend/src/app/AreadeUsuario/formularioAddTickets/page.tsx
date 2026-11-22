"use client";

import { ta } from "@/i18n/active";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { TbBuilding, TbSend, TbUser, TbUsers } from "react-icons/tb";
import { api } from "@/services/api";
import { apiErrorMessage } from "@/lib/apiError";
import { toArray } from "@/lib/toArray";
import type { JwtPayload } from "@/lib/JWTpayload.type";
import type { UsuariosProps } from "@/lib/getUsuario.type";
import { UserPortalShell } from "@/components/auth/UserPortalShell";
import { Button, Card, CardHeader, Field, Input, Select, Textarea } from "@/components/ui";

type Option = { id: string; name: string };

// "Ticket" type of service order — chamados opened by end users are always tickets.
const TIPO_OS_TICKET = "94e32deb-2a02-41f1-9573-b4b5c265e80a";

function gerarNumeroOS() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function userIdFromToken() {
  const token = getCookie("session");
  if (typeof token !== "string") return undefined;
  try {
    return jwtDecode<JwtPayload>(token).sub;
  } catch {
    return undefined;
  }
}

export default function FormularioAddTickets() {
  const router = useRouter();
  const [tipos, setTipos] = useState<Option[]>([]);
  const [usuario, setUsuario] = useState<UsuariosProps | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api
      .get("/listtipodechamado")
      .then((response) => setTipos(toArray<Option>(response.data)))
      .catch(() => toast.error(ta({ pt: "Não foi possível carregar os tipos de chamado.", en: "Couldn't load the ticket types." })));
    api
      .get("/users/detail")
      .then((response) => setUsuario(response.data as UsuariosProps))
      .catch(() => undefined);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = new FormData(event.currentTarget);
    const text = (key: string) => form.get(key)?.toString().trim() ?? "";

    const user_id = usuario?.id ?? userIdFromToken();
    if (!user_id) {
      toast.error(ta({ pt: "Sessão expirada. Faça login novamente.", en: "Session expired. Please sign in again." }));
      router.push("/AreadeUsuario");
      return;
    }

    const payload: Record<string, unknown> = {
      numeroOS: gerarNumeroOS(),
      name: text("name"),
      tipodeChamado_id: text("tipodeChamado_id"),
      tipodeOrdemdeServico_id: TIPO_OS_TICKET,
      descricaodoProblemaouSolicitacao: text("descricaodoProblemaouSolicitacao"),
      patrimoniodoequipamento: text("patrimoniodoequipamento"),
      nomedoContatoaserProcuradonoLocal: text("nomedoContatoaserProcuradonoLocal") || null,
      user_id,
    };
    if (usuario?.cliente?.id) payload.cliente_id = usuario.cliente.id;
    if (usuario?.instituicaoUnidade?.id) payload.instituicaoUnidade_id = usuario.instituicaoUnidade.id;
    if (usuario?.tecnico?.id) payload.tecnico_id = usuario.tecnico.id;

    setSending(true);
    try {
      await api.post("/ordemdeservico", payload);
      router.push("/AreadeUsuario/formularioenviado");
    } catch (error) {
      toast.error(apiErrorMessage(error, ta({ pt: "Erro ao enviar. Verifique os campos e tente novamente.", en: "Couldn't send. Check the fields and try again." })));
      setSending(false);
    }
  }

  const local = usuario?.instituicaoUnidade?.name ?? usuario?.cliente?.name;

  return (
    <UserPortalShell>
      <div className="relative isolate mb-6 overflow-hidden rounded-card border border-border bg-card px-6 py-7 sm:px-8">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_100%_0%,rgba(21,48,234,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(60%_120%_at_100%_0%,rgba(64,93,229,0.35)_0%,transparent_70%)]"
        />
        <div>
          <span className="inline-flex items-center gap-2 rounded-chip border border-border-accent bg-badge px-2.5 py-1 text-xs font-medium uppercase tracking-[0.02em] text-eyebrow">
            {ta({ pt: "Novo chamado", en: "New ticket" })}
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-link sm:text-[28px]">
            {usuario ? ta({ pt: `Olá, ${usuario.name.split(" ")[0]}!`, en: `Hi, ${usuario.name.split(" ")[0]}!` }) : ta({ pt: "Bem-vindo ao Fire OS", en: "Welcome to Fire OS" })}
          </h1>
          <p className="mt-2 max-w-xl text-bodytext">
            {ta({ pt: "Descreva o problema abaixo e nossa equipe técnica entrará em contato para o atendimento.", en: "Describe the problem below and our technical team will get in touch to schedule the service." })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={ta({ pt: "Nova ordem de serviço", en: "New work order" })} subtitle={ta({ pt: "Campos com * são obrigatórios.", en: "Fields marked with * are required." })} />
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label={ta({ pt: "Nome do solicitante", en: "Requester name" })} htmlFor="name" required>
              <Input id="name" name="name" placeholder={ta({ pt: "Nome completo", en: "Full name" })} required defaultValue={usuario?.name} key={usuario?.id} />
            </Field>
            <Field label={ta({ pt: "Tipo de chamado", en: "Ticket type" })} htmlFor="tipodeChamado_id" required>
              <Select id="tipodeChamado_id" name="tipodeChamado_id" required defaultValue="">
                <option value="" disabled>
                  {tipos.length ? ta({ pt: "Selecione", en: "Select" }) : ta({ pt: "Carregando...", en: "Loading..." })}
                </option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={ta({ pt: "Descrição do problema ou solicitação", en: "Problem or request description" })} htmlFor="descricao" required className="md:col-span-2">
              <Textarea
                id="descricao"
                name="descricaodoProblemaouSolicitacao"
                rows={5}
                placeholder={ta({ pt: "Descreva o problema com o máximo de detalhes possível...", en: "Describe the problem in as much detail as possible..." })}
                required
              />
            </Field>
            <Field label={ta({ pt: "Patrimônio do equipamento", en: "Equipment asset tag" })} htmlFor="patrimonio" required hint={ta({ pt: "Número da etiqueta de patrimônio.", en: "Asset tag number." })}>
              <Input id="patrimonio" name="patrimoniodoequipamento" placeholder={ta({ pt: "Ex.: 56971", en: "E.g. 56971" })} required />
            </Field>
            <Field label={ta({ pt: "Contato no local", en: "On-site contact" })} htmlFor="contato" hint={ta({ pt: "Opcional — quem o técnico deve procurar.", en: "Optional — who the technician should look for." })}>
              <Input id="contato" name="nomedoContatoaserProcuradonoLocal" placeholder={ta({ pt: "Nome do contato", en: "Contact name" })} />
            </Field>
            <div className="flex justify-end border-t border-border pt-5 md:col-span-2">
              <Button type="submit" size="lg" loading={sending} icon={<TbSend className="h-4 w-4" />}>
                {ta({ pt: "Enviar chamado", en: "Send ticket" })}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="h-fit">
          <CardHeader title={ta({ pt: "Seus dados", en: "Your details" })} subtitle={ta({ pt: "Vinculados automaticamente ao chamado.", en: "Linked to the ticket automatically." })} />
          <ul className="flex flex-col gap-4">
            {[
              { icon: <TbUser />, label: ta({ pt: "Usuário", en: "User" }), value: usuario?.name },
              { icon: <TbUsers />, label: ta({ pt: "Setor", en: "Department" }), value: usuario?.setor?.name },
              { icon: <TbBuilding />, label: ta({ pt: "Local", en: "Location" }), value: local },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn border border-border-accent bg-badge text-lg text-primarytext dark:text-periwinkle-2">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted">{item.label}</p>
                  <p className="truncate text-sm font-medium text-link">{item.value ?? "—"}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </UserPortalShell>
  );
}
