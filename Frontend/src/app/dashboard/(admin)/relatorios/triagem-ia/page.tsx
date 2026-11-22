"use client";

import { ta } from "@/i18n/active";
import { useState } from "react";
import {
  TbArrowsExchange,
  TbCheck,
  TbChecks,
  TbPlayerPause,
  TbPlayerPlay,
  TbSearch,
  TbSparkles,
  TbTag,
  TbTicket,
  TbTool,
  TbUserCheck,
  TbX,
} from "react-icons/tb";
import { Badge, Button, Card, CardHeader } from "@/components/ui";
import { HeroCard } from "@/features/dashboard/HeroCard";

type Stage =
  | "idle"
  | "classificando"
  | "buscando"
  | "sugerindo"
  | "aguardando"
  | "trocando"
  | "aprovado"
  | "rejeitado";

const tecnicosDisponiveis = ["Carlos Souza", "Mariana Lima", "Rafael Pereira"];

const casosParecidos = [
  {
    os: "#48102",
    resumo: { pt: "Troca de rolete, resolvido em 1 visita", en: "Roller replaced, solved in 1 visit" },
    dias: { pt: "há 12 dias", en: "12 days ago" },
  },
  {
    os: "#47988",
    resumo: { pt: "Mesmo defeito, chamado foi reaberto 2 vezes", en: "Same fault, ticket reopened twice" },
    dias: { pt: "há 41 dias", en: "41 days ago" },
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** A node in the flow: icon badge + connecting line + content, in the order it was reached. */
function FlowNode({
  icon,
  title,
  tone = "primary",
  dashed = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tone?: "primary" | "success" | "error" | "warning";
  dashed?: boolean;
  children: React.ReactNode;
}) {
  const toneClasses = {
    primary: "bg-lightprimary text-primarytext",
    success: "bg-lightsuccess text-successtext",
    error: "bg-lighterror text-errortext",
    warning: "bg-lightwarning text-warningtext",
  }[tone];

  return (
    <li className="relative pb-8 pl-12 last:pb-0">
      <span className="absolute left-0 top-0 ml-[3px] h-full w-px bg-border last:hidden" aria-hidden />
      <span
        className={`absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full text-sm ${toneClasses}`}
      >
        {icon}
      </span>
      <div className={`rounded-xl border p-4 ${dashed ? "border-dashed border-warning/50 bg-lightwarning/40" : "border-border bg-card"}`}>
        <p className="mb-2 text-sm font-semibold text-link">{title}</p>
        {children}
      </div>
    </li>
  );
}

export default function TriagemIAPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [tecnicoEscolhido, setTecnicoEscolhido] = useState("Juliana Rocha");

  async function simular() {
    setStage("classificando");
    await wait(900);
    setStage("buscando");
    await wait(1000);
    setStage("sugerindo");
    await wait(900);
    setStage("aguardando");
  }

  const reached = (...stages: Stage[]) => stages.includes(stage) || ["aprovado", "rejeitado"].includes(stage);

  return (
    <div className="flex flex-col gap-6">
      <HeroCard>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge tone="primary" className="ring-1 ring-inset ring-primary/20">
              <TbSparkles className="mr-1 inline h-3.5 w-3.5" /> {ta({ pt: "Triagem automática", en: "Automatic triage" })}
            </Badge>
            <h1 className="mt-3 text-2xl font-semibold text-link">{ta({ pt: "Agente de triagem de chamados", en: "Ticket triage agent" })}</h1>
            <p className="mt-1 text-sm text-bodytext">
              {ta({ pt: "Organograma que se abre em etapas — cada passo depende do resultado do anterior, com pausa para sua aprovação.", en: "Flowchart that unfolds in steps — each step depends on the previous result, with a pause for your approval." })}
            </p>
          </div>
          <Button onClick={simular} disabled={stage !== "idle"} icon={<TbPlayerPlay className="h-4 w-4" />}>
            {ta({ pt: "Simular novo chamado", en: "Simulate new ticket" })}
          </Button>
        </div>
      </HeroCard>

      <div className="rounded-lg border border-warning/30 bg-lightwarning px-4 py-3 text-sm text-warningtext">
        <strong className="font-semibold">{ta({ pt: "Protótipo de interface:", en: "Interface prototype:" })}</strong> {ta({ pt: "a classificação, os casos parecidos e a sugestão de técnico são fixos (exemplo). Na implementação real, isso é um grafo (LangGraph): classificar → buscar casos parecidos → sugerir técnico → pausa para aprovação → atribuir — cada seta é um passo de código, só a classificação e a redação usam IA de verdade.", en: "the classification, similar cases and technician suggestion are fixed (example). In the real implementation this is a graph (LangGraph): classify → find similar cases → suggest a technician → pause for approval → assign — each arrow is a code step, only the classification and the wording use real AI." })}
      </div>

      <Card>
        <CardHeader title={ta({ pt: "Chamado recebido", en: "Ticket received" })} subtitle={ta({ pt: "Aberto pela Área do Usuário", en: "Opened from the Customer Area" })} />
        <ol>
          <FlowNode icon={<TbTicket className="h-4 w-4" />} title={ta({ pt: "Novo chamado — EMEF Monteiro Lobato", en: "New ticket — EMEF Monteiro Lobato" })} tone="primary">
            <p className="text-sm text-bodytext">
              {ta({ pt: "“A impressora da secretaria parou de imprimir, já tentamos reiniciar e não resolveu. Precisamos com urgência, temos boletins pra entregar.”", en: "“The department's printer stopped printing, we already tried restarting it and it didn't help. We need it urgently, we have report cards to hand out.”" })}
            </p>
            <p className="mt-2 text-xs text-muted">{ta({ pt: "Aberto por Mariana (usuária) · agora", en: "Opened by Mariana (user) · just now" })}</p>
          </FlowNode>

          {stage === "idle" && (
            <li className="pl-12 text-sm text-muted">{ta({ pt: "Clique em “Simular novo chamado” para ver a triagem acontecer.", en: "Click “Simulate new ticket” to watch the triage happen." })}</li>
          )}

          {reached("classificando", "buscando", "sugerindo", "aguardando", "trocando") && (
            <FlowNode icon={<TbTag className="h-4 w-4" />} title={ta({ pt: "1. Classificar", en: "1. Classify" })} tone="primary">
              {stage === "classificando" ? (
                <p className="text-sm text-bodytext">{ta({ pt: "Classificando categoria e prioridade...", en: "Classifying category and priority..." })}</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="info">{ta({ pt: "Categoria: Hardware / Impressora", en: "Category: Hardware / Printer" })}</Badge>
                    <Badge tone="warning">{ta({ pt: "Prioridade sugerida: Alta", en: "Suggested priority: High" })}</Badge>
                  </div>
                  <Badge tone="neutral" className="mt-2 font-mono text-[10px]">{ta({ pt: "classificarChamado()", en: "classificarChamado()" })}</Badge>
                </>
              )}
            </FlowNode>
          )}

          {reached("buscando", "sugerindo", "aguardando", "trocando") && (
            <FlowNode icon={<TbSearch className="h-4 w-4" />} title={ta({ pt: "2. Buscar casos parecidos", en: "2. Find similar cases" })} tone="primary">
              {stage === "buscando" ? (
                <p className="text-sm text-bodytext">{ta({ pt: "Procurando chamados parecidos no histórico...", en: "Looking for similar tickets in the history..." })}</p>
              ) : (
                <>
                  <ul className="flex flex-col gap-1.5 text-sm text-bodytext">
                    {casosParecidos.map((caso) => (
                      <li key={caso.os}>
                        <strong className="text-link">{caso.os}</strong> — {ta(caso.resumo)}{" "}
                        <span className="text-xs text-muted">({ta(caso.dias)})</span>
                      </li>
                    ))}
                  </ul>
                  <Badge tone="neutral" className="mt-2 font-mono text-[10px]">{ta({ pt: "buscarCasosParecidos(categoria: impressora)", en: "buscarCasosParecidos(categoria: impressora)" })}</Badge>
                </>
              )}
            </FlowNode>
          )}

          {reached("sugerindo", "aguardando", "trocando") && (
            <FlowNode icon={<TbUserCheck className="h-4 w-4" />} title={ta({ pt: "3. Sugerir técnico", en: "3. Suggest a technician" })} tone="primary">
              {stage === "sugerindo" ? (
                <p className="text-sm text-bodytext">{ta({ pt: "Avaliando carga da equipe...", en: "Checking the team's workload..." })}</p>
              ) : (
                <>
                  <p className="text-sm text-bodytext">
                    <strong className="text-link">{ta({ pt: "Juliana Rocha", en: "Juliana Rocha" })}</strong> {ta({ pt: "— já atendeu casos parecidos, categoria compatível, e está com a menor carga da equipe (14 chamados, 35% abaixo da média).", en: "— has handled similar cases, matching category, and has the lightest workload on the team (14 tickets, 35% below average)." })}
                  </p>
                  <Badge tone="neutral" className="mt-2 font-mono text-[10px]">{ta({ pt: "sugerirTecnico(categoria, carga)", en: "sugerirTecnico(categoria, carga)" })}</Badge>
                </>
              )}
            </FlowNode>
          )}

          {stage === "aguardando" && (
            <FlowNode icon={<TbPlayerPause className="h-4 w-4" />} title={ta({ pt: "4. Aguardando sua aprovação", en: "4. Waiting for your approval" })} tone="warning" dashed>
              <p className="mb-3 text-sm text-bodytext">
                {ta({ pt: "O fluxo parou aqui de propósito. A IA sugere, mas quem decide atribuir é você — o estado fica salvo e espera sua resposta, mesmo que o sistema reinicie nesse meio tempo.", en: "The flow stopped here on purpose. AI suggests, but you decide on the assignment — the state is saved and waits for your answer, even if the system restarts in the meantime." })}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" icon={<TbChecks className="h-4 w-4" />} onClick={() => setStage("aprovado")}>
                  {ta({ pt: "Aprovar e atribuir a Juliana Rocha", en: "Approve and assign to Juliana Rocha" })}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<TbArrowsExchange className="h-4 w-4" />}
                  onClick={() => setStage("trocando")}
                >
                  {ta({ pt: "Trocar técnico", en: "Change technician" })}
                </Button>
                <Button size="sm" variant="lightDanger" icon={<TbX className="h-4 w-4" />} onClick={() => setStage("rejeitado")}>
                  {ta({ pt: "Rejeitar sugestão", en: "Reject suggestion" })}
                </Button>
              </div>
            </FlowNode>
          )}

          {stage === "trocando" && (
            <FlowNode icon={<TbArrowsExchange className="h-4 w-4" />} title={ta({ pt: "4. Escolher outro técnico", en: "4. Choose another technician" })} tone="warning" dashed>
              <div className="flex flex-wrap gap-1.5">
                {tecnicosDisponiveis.map((nome) => (
                  <button
                    key={nome}
                    type="button"
                    onClick={() => {
                      setTecnicoEscolhido(nome);
                      setStage("aprovado");
                    }}
                    className="rounded-full bg-lightprimary px-3 py-1.5 text-xs font-medium text-primarytext transition-colors hover:bg-primary hover:text-white"
                  >
                    {nome}
                  </button>
                ))}
              </div>
            </FlowNode>
          )}

          {stage === "aprovado" && (
            <FlowNode icon={<TbCheck className="h-4 w-4" />} title={ta({ pt: "5. Atribuído", en: "5. Assigned" })} tone="success">
              <p className="text-sm text-bodytext">
                {ta({ pt: "Chamado atribuído a", en: "Ticket assigned to" })} <strong className="text-link">{tecnicoEscolhido}</strong>{ta({ pt: ". Ela foi notificada no app e o chamado entrou na fila dela.", en: ". She was notified in the app and the ticket is now in her queue." })}
              </p>
            </FlowNode>
          )}

          {stage === "rejeitado" && (
            <FlowNode icon={<TbX className="h-4 w-4" />} title={ta({ pt: "5. Sugestão rejeitada", en: "5. Suggestion rejected" })} tone="error">
              <p className="text-sm text-bodytext">
                {ta({ pt: "O chamado voltou para a fila manual — nenhum técnico foi atribuído automaticamente.", en: "The ticket went back to the manual queue — no technician was assigned automatically." })}
              </p>
            </FlowNode>
          )}
        </ol>
      </Card>

      {(stage === "aprovado" || stage === "rejeitado") && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setStage("idle")}
            className="flex items-center gap-1.5 text-sm font-medium text-primarytext hover:underline"
          >
            <TbTool className="h-4 w-4" /> {ta({ pt: "Simular outro chamado", en: "Simulate another ticket" })}
          </button>
        </div>
      )}
    </div>
  );
}
