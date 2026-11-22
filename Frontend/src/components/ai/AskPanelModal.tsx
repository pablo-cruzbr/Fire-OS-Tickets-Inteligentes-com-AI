"use client";

import { ta } from "@/i18n/active";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import {
  TbBulb,
  TbCheck,
  TbExternalLink,
  TbMenu2,
  TbRobot,
  TbSend2,
  TbSparkles,
  TbTool,
  TbUser,
  TbUserShare,
} from "react-icons/tb";
import { Badge, Button, Modal, Spinner } from "@/components/ui";

/** Fictitious name for the assistant persona — Fire OS's own AI, not a generic "IA". */
const ASSISTANT_NAME = "Agnis";

/** "Everyone" option of the multi-pick lists; picking it clears the others. */
const ALL_OPTION = () => ta({ pt: "Todos", en: "Everyone" });

const tecnicosDisponiveis = ["Carlos Souza", "Mariana Lima", "Rafael Pereira", "Juliana Rocha"];

/** A confirm can just state what was done, or state it AND suggest the next action — it doesn't have to be a dead end. */
type ConfirmResult = string | { text: string; action?: NextAction; link?: { label: string; href: string } };

type NextAction = {
  label: string;
  options: string[];
  /** Checkboxes instead of single-pick buttons — Agnis waits for a "Confirmar" click. */
  multi?: boolean;
  /** Confirmation message once the gestor finishes picking — not a generic "Feito: X". */
  confirm: (selected: string[]) => ConfirmResult;
  /** Picking an option can drill into another question instead of confirming right away (e.g. "which técnicos?"). */
  followUp?: (selected: string[]) => NextAction | undefined;
};

type ChatMessage = {
  role: "user" | "ai";
  text: string;
  tools?: string[];
  action?: NextAction;
  /** Once the gestor picks an option from `action`, we record it here and show the result instead of the menu. */
  actionResult?: string;
  /** Some confirmations hand off to the real tool instead of faking the result (e.g. scheduling → the actual calendar). */
  link?: { label: string; href: string };
};

/*
 * Menu of the questions a gestor actually asks day to day, grouped the way
 * they think about the operation — not a flat list. Each one has a matching
 * canned answer below; keep the two in sync when adding a question. Built on
 * call (not at module load) so it follows the current language.
 */
function questionGroupsFor(): { label: string; questions: string[] }[] {
  return [
    {
      label: ta({ pt: "Chamados", en: "Tickets" }),
      questions: [
        ta({ pt: "Quantos chamados estão abertos agora?", en: "How many tickets are open right now?" }),
        ta({ pt: "Quantos chamados estão fora do prazo?", en: "How many tickets are overdue?" }),
        ta({ pt: "Qual é a OS mais atrasada?", en: "Which is the most overdue work order?" }),
      ],
    },
    {
      label: ta({ pt: "Técnicos", en: "Technicians" }),
      questions: [
        ta({ pt: "Qual técnico está mais sobrecarregado?", en: "Which technician is the most overloaded?" }),
        ta({ pt: "Qual técnico demora mais por atendimento?", en: "Which technician takes longest per job?" }),
      ],
    },
    {
      label: ta({ pt: "Clientes e instituições", en: "Customers and institutions" }),
      questions: [
        ta({ pt: "Qual secretaria teve mais OS em setembro?", en: "Which department had the most work orders in September?" }),
        ta({ pt: "Qual cliente abriu mais chamados este mês?", en: "Which customer opened the most tickets this month?" }),
      ],
    },
    {
      label: ta({ pt: "Equipamentos", en: "Equipment" }),
      questions: [
        ta({ pt: "Qual equipamento quebrou mais vezes?", en: "Which equipment broke down the most?" }),
        ta({ pt: "Quantos equipamentos aguardam peça?", en: "How many pieces of equipment are awaiting parts?" }),
      ],
    },
  ];
}

/*
 * Canned answers, matched by keyword (Portuguese or English). This is a UI
 * mockup only — no LLM, no backend call. Each entry mirrors the shape the real
 * feature would return: an answer plus which "tools" (fixed functions)
 * supposedly ran, matching docs/GUIA-IA-FIRE-OS.md's tool-calling design.
 * Order matters: the first regex that matches wins, so the more specific ones
 * come first. Option labels are compared with the same translated strings.
 */
function cannedAnswersFor(): { match: RegExp; text: string; tools: string[]; action?: NextAction }[] {
  const notify = ta({ pt: "Notificar os técnicos responsáveis", en: "Notify the technicians in charge" });
  const everyone = ALL_OPTION();
  const prioritizeWaiting = ta({ pt: "Priorizar os que aguardam início", en: "Prioritize the ones waiting to start" });
  const redistribute = ta({ pt: "Redistribuir parte da carga dele", en: "Redistribute part of his workload" });
  const training = ta({ pt: "Agendar treinamento técnico", en: "Schedule technical training" });
  const redistributeNext = ta({ pt: "Redistribuir próximos chamados dele", en: "Redistribute his upcoming tickets" });
  const confirmThursday = ta({ pt: "Confirmar quinta-feira, 14h", en: "Confirm Thursday, 2 PM" });
  const meeting = ta({ pt: "Agendar reunião de alinhamento", en: "Schedule an alignment meeting" });
  const preventiveVisit = ta({ pt: "Agendar visita técnica preventiva", en: "Schedule a preventive visit" });
  const replace = ta({ pt: "Abrir solicitação de troca", en: "Open a replacement request" });
  const chaseSupplier = ta({ pt: "Cobrar fornecedor das peças atrasadas", en: "Chase the supplier for the late parts" });
  const chasePending = ta({ pt: "Cobrar fornecedor das peças pendentes", en: "Chase the supplier for the pending parts" });

  return [
    {
      match: /os mais atrasada|chamado mais atrasado|most overdue/i,
      text: ta({
        pt: "A OS mais atrasada é a #48217 (UBS Jardim das Flores) — parada há 6 dias aguardando peça, 3 dias além do prazo combinado. Ela ainda não tem técnico atribuído. Recomendo atribuir agora pra não passar mais um dia parada.",
        en: "The most overdue work order is #48217 (UBS Jardim das Flores) — stuck for 6 days awaiting a part, 3 days past the agreed deadline. It has no technician yet. I recommend assigning it now so it doesn't sit for another day.",
      }),
      tools: ["osMaisAtrasada(criterio: sla)"],
      action: {
        label: ta({ pt: "Atribuir a um técnico", en: "Assign to a technician" }),
        options: tecnicosDisponiveis,
        confirm: ([nome]) =>
          ta({
            pt: `OS #48217 atribuída a ${nome}. Ela foi notificada no app e a OS entrou na fila dela.`,
            en: `WO #48217 assigned to ${nome}. They were notified in the app and the work order is now in their queue.`,
          }),
      },
    },
    {
      match: /fora do prazo|sla|overdue/i,
      text: ta({
        pt: "4 chamados estão fora do prazo combinado (mais de 48h sem atualização) — 3 deles são da Secretaria de Educação. Posso priorizar esses 4 agora, pra não acumularem mais atraso.",
        en: "4 tickets are past the agreed deadline (no update for over 48h) — 3 of them are from the Department of Education. I can prioritize these 4 now so they don't fall further behind.",
      }),
      tools: ["chamadosForaDoPrazo(limiteHoras: 48)"],
      action: {
        label: ta({ pt: "O que fazer com esses 4 chamados?", en: "What should we do with these 4 tickets?" }),
        options: [ta({ pt: "Marcar como urgente", en: "Mark as urgent" }), notify],
        confirm: () =>
          ta({
            pt: "Os 4 chamados fora do prazo foram marcados como urgentes e subiram no topo da fila dos técnicos.",
            en: "The 4 overdue tickets were marked urgent and moved to the top of the technicians' queue.",
          }),
        followUp: ([opcao]) => {
          if (opcao !== notify) return undefined;
          return {
            label: ta({ pt: "Quais técnicos notificar?", en: "Which technicians should be notified?" }),
            options: ["Carlos Souza", "Mariana Lima", "Rafael Pereira", everyone],
            multi: true,
            confirm: (selected) => {
              const todos = selected.includes(everyone);
              return todos
                ? ta({
                    pt: "Todos os técnicos responsáveis foram notificados agora, com o prazo já vencido em destaque.",
                    en: "All technicians in charge were notified now, with the missed deadline highlighted.",
                  })
                : ta({
                    pt: `${selected.join(" e ")} ${selected.length > 1 ? "foram notificados" : "foi notificado"} agora, com o prazo já vencido em destaque.`,
                    en: `${selected.join(" and ")} ${selected.length > 1 ? "were" : "was"} notified now, with the missed deadline highlighted.`,
                  });
            },
          };
        },
      },
    },
    {
      match: /abert[oa]s? agora|quantos chamados.*abert|open right now|tickets are open/i,
      text: ta({
        pt: "Existem 23 chamados abertos agora: 5 em deslocamento, 5 em andamento e 13 aguardando início.",
        en: "There are 23 open tickets right now: 5 on the way, 5 in progress and 13 waiting to start.",
      }),
      tools: ["chamadosPorStatus(status: ABERTA)"],
      action: {
        label: ta({ pt: "O que fazer com esses chamados?", en: "What should we do with these tickets?" }),
        options: [prioritizeWaiting, ta({ pt: "Ver detalhamento por técnico", en: "See the breakdown by technician" })],
        confirm: ([opcao]) =>
          opcao === prioritizeWaiting
            ? ta({
                pt: "Os 13 chamados aguardando início foram priorizados e subiram na fila dos técnicos disponíveis.",
                en: "The 13 tickets waiting to start were prioritized and moved up the available technicians' queue.",
              })
            : {
                text: ta({ pt: "Por técnico: Carlos Souza (9), Mariana Lima (6), Rafael Pereira (5), Juliana Rocha (3). Carlos Souza está com quase o dobro dos demais.", en: "By technician: Carlos Souza (9), Mariana Lima (6), Rafael Pereira (5), Juliana Rocha (3). Carlos Souza has almost twice as many as the others." }),
                action: {
                  label: ta({ pt: "Carlos Souza está sobrecarregado — o que fazer?", en: "Carlos Souza is overloaded — what should we do?" }),
                  options: [redistribute, ta({ pt: "Manter como está", en: "Keep it as is" })],
                  confirm: ([escolha]) =>
                    escolha === redistribute
                      ? ta({
                          pt: "3 chamados de Carlos Souza foram redistribuídos para Juliana Rocha. Os dois técnicos foram notificados no app.",
                          en: "3 of Carlos Souza's tickets were reassigned to Juliana Rocha. Both technicians were notified in the app.",
                        })
                      : ta({
                          pt: "Ok, mantendo a distribuição atual — vou avisar se a diferença aumentar.",
                          en: "OK, keeping the current distribution — I'll let you know if the gap grows.",
                        }),
                },
              },
      },
    },
    {
      match: /sobrecarregad|maior carga|mais chamados.*t[ée]cnico|overloaded/i,
      text: ta({
        pt: "Carlos Souza está com a maior carga: 28 chamados neste mês, 40% acima da média da equipe (20). Juliana Rocha e Rafael Pereira estão com folga pra absorver parte disso.",
        en: "Carlos Souza has the heaviest workload: 28 tickets this month, 40% above the team average (20). Juliana Rocha and Rafael Pereira have room to take part of it.",
      }),
      tools: ["cargaPorTecnico(periodo: 2026-09)"],
      action: {
        label: ta({ pt: "Redistribuir parte da carga de Carlos Souza", en: "Redistribute part of Carlos Souza's workload" }),
        options: [
          ta({ pt: "Juliana Rocha (14 chamados)", en: "Juliana Rocha (14 tickets)" }),
          ta({ pt: "Rafael Pereira (18 chamados)", en: "Rafael Pereira (18 tickets)" }),
        ],
        confirm: ([nome]) =>
          ta({
            pt: `3 chamados de Carlos Souza foram redistribuídos para ${nome.split(" (")[0]}. Os dois técnicos foram notificados no app.`,
            en: `3 of Carlos Souza's tickets were reassigned to ${nome.split(" (")[0]}. Both technicians were notified in the app.`,
          }),
      },
    },
    {
      match: /demora|tempo m[ée]dio|longest|average time/i,
      text: ta({
        pt: "Carlos Souza também tem o maior tempo médio por atendimento: 2h40min, cerca de 45 minutos acima da média da equipe (1h55min).",
        en: "Carlos Souza also has the longest average time per job: 2h40min, about 45 minutes above the team average (1h55min).",
      }),
      tools: ["tempoMedioPorTecnico(periodo: 2026-09)"],
      action: {
        label: ta({ pt: "O que fazer com o tempo de atendimento de Carlos Souza?", en: "What should we do about Carlos Souza's service time?" }),
        options: [training, redistributeNext],
        confirm: ([opcao]) =>
          // The training option is always intercepted by the followUp below before it gets here.
          opcao === redistributeNext
            ? ta({
                pt: "Os próximos chamados da categoria dele passam a ser distribuídos para Juliana Rocha e Rafael Pereira.",
                en: "Upcoming tickets in his category will now go to Juliana Rocha and Rafael Pereira.",
              })
            : ta({ pt: "Treinamento técnico agendado para Carlos Souza.", en: "Technical training scheduled for Carlos Souza." }),
        followUp: ([opcao]) => {
          if (opcao !== training) return undefined;
          return {
            label:
              ta({ pt: "A agenda de Carlos Souza está livre quinta-feira às 14h, logo após o horário de pico de chamados — quer agendar nesse horário?", en: "Carlos Souza's schedule is free on Thursday at 2 PM, right after the ticket peak — want to book it then?" }),
            options: [confirmThursday, ta({ pt: "Ver outros horários no calendário", en: "See other times on the calendar" })],
            confirm: ([horario]) =>
              horario === confirmThursday
                ? {
                    text: ta({ pt: "Treinamento agendado para quinta-feira, 14h. Carlos Souza foi notificado e o evento já está no Calendário técnico.", en: "Training scheduled for Thursday, 2 PM. Carlos Souza was notified and the event is already on the Technician calendar." }),
                    link: { label: ta({ pt: "Ver no Calendário técnico", en: "View in Technician calendar" }), href: "/dashboard/ticketscount" },
                  }
                : {
                    text: ta({ pt: "Abra o Calendário técnico pra escolher outro horário disponível com a equipe.", en: "Open the Technician calendar to pick another time when the team is available." }),
                    link: { label: ta({ pt: "Abrir Calendário técnico", en: "Open Technician calendar" }), href: "/dashboard/ticketscount" },
                  },
          };
        },
      },
    },
    {
      match: /secretaria|department/i,
      text: ta({
        pt: "A Secretaria de Educação teve mais ordens de serviço em setembro: 54 no total, 35% a mais que em agosto. A UBS Jardim das Flores vem em segundo lugar, com 21 OS.",
        en: "The Department of Education had the most work orders in September: 54 in total, 35% more than in August. UBS Jardim das Flores comes second, with 21 work orders.",
      }),
      tools: ["osPorSecretaria(periodo: 2026-09)"],
      action: {
        label: ta({ pt: "O que fazer com a Secretaria de Educação?", en: "What should we do about the Department of Education?" }),
        options: [meeting, ta({ pt: "Enviar relatório detalhado por e-mail", en: "Email a detailed report" })],
        confirm: ([opcao]) =>
          opcao === meeting
            ? ta({
                pt: "Reunião solicitada com a Secretaria de Educação — o contato responsável foi notificado.",
                en: "Meeting requested with the Department of Education — the contact in charge was notified.",
              })
            : ta({
                pt: "Relatório detalhado de setembro enviado por e-mail para a Secretaria de Educação.",
                en: "Detailed September report emailed to the Department of Education.",
              }),
      },
    },
    {
      match: /cliente.*abriu|abriu.*chamados|customer opened|opened the most/i,
      text: ta({
        pt: "Construtora Horizonte Ltda abriu 9 chamados este mês, a maioria relacionada a equipamentos de rede.",
        en: "Construtora Horizonte Ltda opened 9 tickets this month, most of them about network equipment.",
      }),
      tools: ["chamadosPorCliente(periodo: 2026-09)"],
      action: {
        label: ta({ pt: "O que fazer com a Construtora Horizonte Ltda?", en: "What should we do about Construtora Horizonte Ltda?" }),
        options: [preventiveVisit, ta({ pt: "Enviar relatório dos equipamentos de rede", en: "Send the network equipment report" })],
        confirm: ([opcao]) =>
          opcao === preventiveVisit
            ? ta({
                pt: "Visita técnica preventiva agendada com a Construtora Horizonte Ltda.",
                en: "Preventive visit scheduled with Construtora Horizonte Ltda.",
              })
            : ta({
                pt: "Relatório dos equipamentos de rede enviado para a Construtora Horizonte Ltda.",
                en: "Network equipment report sent to Construtora Horizonte Ltda.",
              }),
      },
    },
    {
      match: /equipamento.*quebr|defeito recorrente|voltou.*vezes|broke down|recurring fault/i,
      text: ta({
        pt: "A impressora HP LaserJet (patrimônio 00245) teve 3 chamados em 30 dias pelo mesmo defeito de rolete. Consertar de novo tende a custar mais do que trocar — o que prefere fazer?",
        en: "The HP LaserJet printer (asset tag 00245) had 3 tickets in 30 days for the same roller fault. Another repair will likely cost more than replacing it — what would you like to do?",
      }),
      tools: ["equipamentosRecorrentes(periodo: 30d)"],
      action: {
        label: ta({ pt: "O que fazer com esse equipamento?", en: "What should we do with this equipment?" }),
        options: [replace, ta({ pt: "Manter em reparo", en: "Keep repairing it" })],
        confirm: ([opcao]) =>
          opcao === replace
            ? ta({
                pt: "Solicitação de compra criada para substituir a impressora (patrimônio 00245). O setor de Compras foi notificado.",
                en: "Purchase request created to replace the printer (asset tag 00245). Purchasing was notified.",
              })
            : ta({
                pt: "Ok, mantendo em reparo — vou continuar de olho, e aviso se o defeito se repetir de novo.",
                en: "OK, keeping it in repair — I'll keep an eye on it and let you know if the fault comes back.",
              }),
      },
    },
    {
      match: /aguard.*peça|peça de reposição|awaiting parts|spare part/i,
      text: ta({
        pt: "6 equipamentos estão parados aguardando peça de reposição, 2 deles há mais de 10 dias.",
        en: "6 pieces of equipment are stuck awaiting spare parts, 2 of them for more than 10 days.",
      }),
      tools: ["equipamentosPorStatus(status: AGUARDANDO_PECA)"],
      action: {
        label: ta({ pt: "O que fazer com esses equipamentos?", en: "What should we do with this equipment?" }),
        options: [chaseSupplier, ta({ pt: "Priorizar os parados há mais de 10 dias", en: "Prioritize the ones stuck for more than 10 days" })],
        confirm: ([opcao]) =>
          opcao === chaseSupplier
            ? ta({ pt: "Cobrança enviada ao fornecedor sobre as peças em atraso.", en: "Reminder sent to the supplier about the late parts." })
            : ta({
                pt: "Os equipamentos parados há mais de 10 dias foram priorizados na fila de reparo.",
                en: "Equipment stuck for more than 10 days was prioritized in the repair queue.",
              }),
      },
    },
    {
      match: /pausad|paused/i,
      text: ta({
        pt: "Existem 6 chamados pausados agora, 4 deles aguardando peça de reposição há mais de 5 dias.",
        en: "There are 6 paused tickets right now, 4 of them awaiting spare parts for more than 5 days.",
      }),
      tools: ["chamadosPorStatus(status: PAUSADA)"],
      action: {
        label: ta({ pt: "O que fazer com os chamados pausados?", en: "What should we do with the paused tickets?" }),
        options: [chasePending, ta({ pt: "Reativar os que já têm peça disponível", en: "Resume the ones whose part is available" })],
        confirm: ([opcao]) =>
          opcao === chasePending
            ? ta({
                pt: "Cobrança enviada ao fornecedor sobre as peças pendentes dos chamados pausados.",
                en: "Reminder sent to the supplier about the pending parts for the paused tickets.",
              })
            : ta({
                pt: "Os chamados com peça já disponível foram reativados e voltaram para a fila dos técnicos.",
                en: "Tickets whose part is available were resumed and are back in the technicians' queue.",
              }),
      },
    },
  ];
}

function fallbackAnswerFor(): { text: string; tools: string[]; action?: NextAction } {
  return {
    text: ta({
      pt: "Encontrei 142 ordens de serviço no período consultado. Tente perguntar sobre um técnico, uma secretaria ou um status específico para uma resposta mais detalhada.",
      en: "I found 142 work orders in the period. Try asking about a technician, a department or a specific status for a more detailed answer.",
    }),
    tools: ["visaoGeralOS()"],
  };
}

function answerFor(question: string) {
  return cannedAnswersFor().find((entry) => entry.match.test(question)) ?? fallbackAnswerFor();
}

/**
 * Generic "analyze again" — the gestor can ask Agnis to re-read any answer and propose
 * what to do next, even ones whose original action already ran its course. Keyed off the
 * answer's own text so it still feels specific to the case, with a generic fallback.
 */
function moreActionsFor(text: string): NextAction {
  if (/Carlos Souza/.test(text)) {
    const history = ta({ pt: "Ver histórico de desempenho dele", en: "See his performance history" });
    return {
      label: ta({ pt: "Analisando de novo — quer que eu continue em cima do caso de Carlos Souza?", en: "Analyzing again — want me to keep going on Carlos Souza's case?" }),
      options: [history, ta({ pt: "Agendar 1:1 de feedback", en: "Schedule a feedback 1:1" })],
      confirm: ([opcao]) =>
        opcao === history
          ? ta({
              pt: "Abri o histórico de desempenho de Carlos Souza dos últimos 3 meses — ele vem melhorando desde o treinamento de agosto.",
              en: "I opened Carlos Souza's performance history for the last 3 months — he's been improving since the August training.",
            })
          : ta({
              pt: "1:1 de feedback agendado com Carlos Souza para essa semana. Ele foi notificado.",
              en: "Feedback 1:1 with Carlos Souza scheduled for this week. He was notified.",
            }),
    };
  }
  if (/impressora|equipamento|printer|equipment/i.test(text)) {
    const history = ta({ pt: "Ver histórico de manutenções", en: "See the maintenance history" });
    return {
      label: ta({ pt: "Analisando de novo — quer saber mais sobre esse equipamento?", en: "Analyzing again — want to know more about this equipment?" }),
      options: [history, ta({ pt: "Agendar manutenção preventiva", en: "Schedule preventive maintenance" })],
      confirm: ([opcao]) =>
        opcao === history
          ? ta({
              pt: "Esse equipamento já teve 5 manutenções nos últimos 6 meses — o custo acumulado já passou do valor de um equipamento novo.",
              en: "This equipment has had 5 repairs in the last 6 months — the total cost is already above the price of a new one.",
            })
          : ta({ pt: "Manutenção preventiva agendada para a próxima semana.", en: "Preventive maintenance scheduled for next week." }),
    };
  }
  if (/Secretaria de Educação|Department of Education/.test(text)) {
    const allTickets = ta({ pt: "Ver todos os chamados dessa secretaria", en: "See all of this department's tickets" });
    return {
      label: ta({ pt: "Analisando de novo — quer ver mais sobre a Secretaria de Educação?", en: "Analyzing again — want to see more about the Department of Education?" }),
      options: [allTickets, ta({ pt: "Comparar com o mês anterior", en: "Compare with the previous month" })],
      confirm: ([opcao]) =>
        opcao === allTickets
          ? {
              text: ta({ pt: "Abri a lista completa de chamados da Secretaria de Educação, filtrada por este mês.", en: "I opened the full list of the Department of Education's tickets, filtered to this month." }),
              link: { label: ta({ pt: "Abrir Chamados", en: "Open Tickets" }), href: "/dashboard/tickets" },
            }
          : ta({
              pt: "Em agosto foram 40 OS, contra 54 em setembro — alta de 35%, concentrada em impressoras e rede.",
              en: "August had 40 work orders versus 54 in September — up 35%, mostly printers and network.",
            }),
    };
  }
  if (/UBS Jardim das Flores|#48217/.test(text)) {
    const notifyUbs = ta({ pt: "Avisar a UBS do novo prazo", en: "Tell the UBS about the new deadline" });
    return {
      label: ta({ pt: "Analisando de novo — algo mais sobre a OS #48217?", en: "Analyzing again — anything else about WO #48217?" }),
      options: [notifyUbs, ta({ pt: "Ver o histórico completo dessa OS", en: "See this work order's full history" })],
      confirm: ([opcao]) =>
        opcao === notifyUbs
          ? ta({ pt: "UBS Jardim das Flores notificada com o novo prazo estimado.", en: "UBS Jardim das Flores notified of the new estimated deadline." })
          : ta({ pt: "Abri o histórico completo da OS #48217, desde a abertura.", en: "I opened the full history of WO #48217, from the start." }),
    };
  }
  const moreDetails = ta({ pt: "Ver mais detalhes na tela de Chamados", en: "See more details on the Tickets screen" });
  return {
    label: ta({ pt: "Analisando de novo — quer mais alguma ação em cima dessa resposta?", en: "Analyzing again — want another action based on this answer?" }),
    options: [moreDetails, ta({ pt: "Exportar como PDF", en: "Export as PDF" })],
    confirm: ([opcao]) =>
      opcao === moreDetails
        ? {
            text: ta({ pt: "Abri a tela de Chamados com os filtros já aplicados dessa consulta.", en: "I opened the Tickets screen with this query's filters already applied." }),
            link: { label: ta({ pt: "Abrir Chamados", en: "Open Tickets" }), href: "/dashboard/tickets" },
          }
        : ta({ pt: "PDF gerado e pronto pra baixar ou compartilhar.", en: "PDF generated, ready to download or share." }),
  };
}

export function AskPanelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  /** Selections in progress for multi-select actions, keyed by message index. */
  const [selections, setSelections] = useState<Record<number, string[]>>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setQuestion("");
    setLoading(true);
    setMenuOpen(false);

    const answer = answerFor(trimmed);
    timeoutRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: answer.text, tools: answer.tools, action: answer.action }]);
      setLoading(false);
    }, 900);
  }

  /** Marks the action as resolved and schedules Agnis's confirmation message. */
  function finishAction(messageIndex: number, action: NextAction, selected: string[], resultLabel: string) {
    setMessages((prev) => {
      const next = [...prev];
      const target = next[messageIndex];
      if (!target?.action) return prev;
      next[messageIndex] = { ...target, actionResult: resultLabel };
      return next;
    });

    const result = action.confirm(selected);
    const resolved = typeof result === "string" ? { text: result, action: undefined, link: undefined } : result;

    setLoading(true);
    timeoutRef.current = setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: resolved.text, action: resolved.action, link: resolved.link }]);
      setLoading(false);
    }, 700);
  }

  /** Gestor picked a single option (e.g. which técnico to assign). May drill into a follow-up question instead of confirming right away. */
  function pickOption(messageIndex: number, option: string) {
    const action = messages[messageIndex]?.action;
    if (!action) return;

    const next = action.followUp?.([option]);
    if (next) {
      setMessages((prev) => {
        const copy = [...prev];
        const target = copy[messageIndex];
        if (!target?.action) return prev;
        copy[messageIndex] = { ...target, action: next };
        return copy;
      });
      return;
    }

    finishAction(messageIndex, action, [option], option);
  }

  /** Toggles one técnico in/out of a multi-select action; picking "everyone" clears the rest, and vice versa. */
  function toggleMultiOption(messageIndex: number, option: string) {
    setSelections((prev) => {
      const current = prev[messageIndex] ?? [];
      let nextSelected: string[];
      if (option === ALL_OPTION()) {
        nextSelected = current.includes(ALL_OPTION()) ? [] : [ALL_OPTION()];
      } else if (current.includes(option)) {
        nextSelected = current.filter((item) => item !== option);
      } else {
        nextSelected = [...current.filter((item) => item !== ALL_OPTION()), option];
      }
      return { ...prev, [messageIndex]: nextSelected };
    });
  }

  function confirmMultiSelect(messageIndex: number) {
    const action = messages[messageIndex]?.action;
    const selected = selections[messageIndex];
    if (!action || !selected?.length) return;

    finishAction(messageIndex, action, selected, selected.includes(ALL_OPTION()) ? ALL_OPTION() : selected.join(", "));
    setSelections((prev) => {
      const copy = { ...prev };
      delete copy[messageIndex];
      return copy;
    });
  }

  /** Gestor asks Agnis to look at an answer again and propose what to do next — works on any ai message, repeatably. */
  function suggestNextStep(messageIndex: number) {
    const message = messages[messageIndex];
    if (!message || message.role !== "ai") return;

    setLoading(true);
    timeoutRef.current = setTimeout(() => {
      setMessages((prev) => {
        const next = [...prev];
        const target = next[messageIndex];
        if (!target) return prev;
        next[messageIndex] = { ...target, action: moreActionsFor(target.text), actionResult: undefined };
        return next;
      });
      setLoading(false);
    }, 800);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    ask(question);
  }

  function handleClose() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessages([]);
    setQuestion("");
    setLoading(false);
    setMenuOpen(true);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title={
        <span className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-brand,linear-gradient(97deg,var(--primary),#7989fa))] text-white shadow-[0_0_24px_-4px_var(--primary)]">
            <TbSparkles className="h-4 w-4" />
          </span>
          {ASSISTANT_NAME}
        </span>
      }
      subtitle={ta({ pt: "Assistente de IA do Fire OS — pergunte sobre chamados e ordens de serviço", en: "Fire OS AI assistant — ask about tickets and work orders" })}
    >
      <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-lightwarning px-3.5 py-2.5 text-xs text-warningtext">
        <TbTool className="mt-0.5 h-4 w-4 shrink-0" />
        {ta({ pt: "Protótipo de interface — as respostas abaixo são fixas (exemplos), ainda sem IA real por trás.", en: "Interface prototype — the answers below are fixed examples, with no real AI behind them yet." })}
      </div>

      {messages.length > 0 && (
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="mb-3 flex items-center gap-1.5 text-xs font-medium text-primarytext hover:underline"
        >
          <TbMenu2 className="h-3.5 w-3.5" /> {menuOpen ? ta({ pt: "Ocultar perguntas", en: "Hide questions" }) : ta({ pt: "Ver mais perguntas", en: "See more questions" })}
        </button>
      )}

      {menuOpen && (
        <div className="mb-5 flex flex-col gap-3.5 border-b border-border pb-5">
          {questionGroupsFor().map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.questions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => ask(item)}
                    className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs font-medium text-link transition-colors hover:border-primary/60 hover:bg-lightprimary hover:text-primarytext"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex min-h-[160px] flex-col gap-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                message.role === "user" ? "bg-[image:var(--gradient-brand,linear-gradient(97deg,var(--primary),#7989fa))] text-white" : "border border-primary/25 bg-lightprimary text-primarytext"
              }`}
            >
              {message.role === "user" ? <TbUser /> : <TbRobot />}
            </span>
            <div className={`max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
              {message.role === "ai" && <p className="mb-1 text-xs font-semibold text-primarytext">{ASSISTANT_NAME}</p>}
              <div
                className={`inline-block rounded-xl px-4 py-2.5 text-sm ${
                  message.role === "user" ? "bg-[image:var(--gradient-brand,linear-gradient(97deg,var(--primary),#7989fa))] text-white" : "border border-border bg-surface text-link"
                }`}
              >
                {message.text}
              </div>
              {message.tools && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {message.tools.map((tool) => (
                    <Badge key={tool} tone="neutral" className="font-mono text-[10px]">
                      {tool}
                    </Badge>
                  ))}
                </div>
              )}

              {message.link && (
                <Link
                  href={message.link.href}
                  onClick={handleClose}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 text-xs font-medium text-primarytext transition-colors hover:bg-primary hover:text-white"
                >
                  <TbExternalLink className="h-3.5 w-3.5" /> {message.link.label}
                </Link>
              )}

              {message.action && (
                <div className="mt-2.5 text-left">
                  {message.actionResult ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-lightsuccess px-3 py-1.5 text-xs font-medium text-successtext">
                      <TbCheck className="h-3.5 w-3.5" /> {message.action.label}: {message.actionResult}
                    </span>
                  ) : (
                    <div className="inline-block rounded-xl border border-border bg-card p-3">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-link">
                        <TbUserShare className="h-3.5 w-3.5 text-primarytext" /> {message.action.label}
                      </p>
                      {message.action.multi ? (
                        <>
                          <div className="flex flex-wrap gap-1.5">
                            {message.action.options.map((option) => {
                              const checked = (selections[index] ?? []).includes(option);
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => toggleMultiOption(index, option)}
                                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                    checked
                                      ? "border-primary bg-primary text-white"
                                      : "border-border bg-transparent text-link hover:border-primary hover:text-primarytext"
                                  }`}
                                >
                                  {checked && <TbCheck className="h-3 w-3" />}
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                          <Button
                            size="sm"
                            className="mt-2.5"
                            disabled={!(selections[index] ?? []).length}
                            onClick={() => confirmMultiSelect(index)}
                          >
                            {ta({ pt: "Confirmar", en: "Confirm" })}
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {message.action.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => pickOption(index, option)}
                              className="rounded-full bg-lightprimary px-3 py-1 text-xs font-medium text-primarytext transition-colors hover:bg-primary hover:text-white"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {message.role === "ai" && !(message.action && !message.actionResult) && (
                <button
                  type="button"
                  onClick={() => suggestNextStep(index)}
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primarytext hover:underline"
                >
                  <TbBulb className="h-3.5 w-3.5" /> {ta({ pt: "Sugerir próximo passo", en: "Suggest next step" })}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primarytext">
              <TbRobot />
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-bodytext">
              <Spinner className="h-4 w-4" /> {ASSISTANT_NAME} {ta({ pt: "está consultando...", en: "is looking it up..." })}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex gap-2 border-t border-border pt-4">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={ta({ pt: "Ex.: quantos chamados estão em aberto?", en: "E.g. how many tickets are open?" })}
          className="h-11 flex-1 rounded-md border border-border bg-transparent px-3.5 text-sm text-link placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-lightprimary"
        />
        <Button type="submit" icon={<TbSend2 className="h-4 w-4" />} disabled={loading || !question.trim()}>
          {ta({ pt: "Perguntar", en: "Ask" })}
        </Button>
      </form>
    </Modal>
  );
}
