import type { Locale } from "@/i18n/routing";
import { useAppLocale } from "@/i18n/text";

/*
 * Copy for the /agnis page, in Portuguese and English. Agnis is a module
 * inside Fire OS, still a prototype/MVP: the page says so, and every example
 * uses fictitious data. Sections read it with useAgnisContent().
 */

export type Severity = "crit" | "warn" | "info";

export type DecisionAction = {
  label: string;
  /** Audit line shown once the action is approved. */
  audit: string;
  primary?: boolean;
};

export type Decision = {
  id: string;
  severity: Severity;
  chip: string;
  tool: string;
  title: string;
  context: string;
  actions: DecisionAction[];
};

export type Actor = "codigo" | "ia" | "pessoa";

export type AgnisClip = {
  /** File basename under public/videos/agnis/ (with an optional `-crop` variant). */
  id: string;
  /** Portal screen the clip was recorded from. */
  screen: string;
  title: string;
  text: string;
};

const pt = {
  agnisHero: {
    eyebrow: "Novo no Fire OS · Agnis",
    title: "Abra o painel do Fire OS e saiba o que decidir hoje.",
    highlight: "o que decidir hoje.",
    lead:
      "A Agnis é a assistente que vem dentro do Fire OS. Ela lê os chamados, as OS, os técnicos e os equipamentos que você já registra, aponta o que precisa de atenção e deixa a ação pronta para um clique.",
    leadStrong: "Sem instalar nada e sem cadastro novo.",
    primaryCta: { label: "Testar a fila de decisões", href: "#fila" },
    secondaryCta: { label: "Ver onde ela entra no Fire OS", href: "#fluxo" },
    facts: [
      { value: "Dentro do painel", label: "que você já usa" },
      { value: "Mesmos 3 perfis", label: "mesmas permissões" },
      { value: "1 clique", label: "para aprovar a ação" },
    ],
  },

  skipLabel: "Ignorar hoje",
  skipAudit: "Ignorado hoje · volta amanhã se a regra continuar valendo",

  decisions: [
    {
      id: "atraso",
      severity: "crit",
      chip: "Fora do prazo",
      tool: "chamadosForaDoPrazo",
      title: "OS 48217 está 26 h além do prazo de alta prioridade",
      context: "Carlos tem 9 OS abertas. Ana tem 2 e atende o mesmo bairro.",
      actions: [
        { label: "Reatribuir para Ana", audit: "Reatribuída para Ana por gestor às 07:42 · regra: OS fora do prazo", primary: true },
        { label: "Marcar urgente", audit: "Marcada como urgente por gestor às 07:42" },
      ],
    },
    {
      id: "recorrente",
      severity: "warn",
      chip: "Equipamento recorrente",
      tool: "equipamentosRecorrentes",
      title: "Impressora PAT-00412 teve 4 OS em 60 dias",
      context: "Três foram o mesmo defeito no rolete. Trocar tende a sair mais barato.",
      actions: [
        {
          label: "Gerar laudo para a secretaria",
          audit: "Laudo de recorrência gerado para a Secretaria de Educação · aprovado por gestor",
          primary: true,
        },
      ],
    },
    {
      id: "pico",
      severity: "info",
      chip: "Pico de chamados",
      tool: "chamadosPorCliente",
      title: "Escola Rio Verde abriu 11 chamados nesta semana",
      context: "A média é 4. Oito são de rede no mesmo prédio.",
      actions: [
        {
          label: "Agendar visita preventiva",
          audit: "Visita preventiva agendada para quinta, 09:00 · abre o Calendário técnico",
          primary: true,
        },
      ],
    },
  ] as Decision[],

  queueNote:
    "Exemplo com dados fictícios. Teste os botões: cada aprovação grava quem aprovou e qual regra originou a sugestão.",

  videoSection: {
    eyebrow: "Protótipo real",
    title: "Pergunte à Agnis, dentro do painel",
    text:
      "Gravação do protótipo que já roda no portal do Fire OS: a Agnis responde sobre chamados e técnicos com os números do próprio sistema e sugere o próximo passo.",
    caption: "Pergunte à Agnis — protótipo dentro do painel",
    points: [
      "Responde com dados calculados pelo sistema, não inventados pelo modelo",
      "Cada resposta termina em uma ação possível",
      "Respeita o perfil de quem pergunta",
    ],
  },

  whySection: {
    eyebrow: "Por que a Agnis",
    title: "Os dados já estão no Fire OS. Falta tempo para procurar neles.",
    subtitle:
      "Chamados, OS, técnicos e equipamentos ficam registrados em várias telas do sistema. O gestor só percebe o problema quando o cliente reclama.",
  },

  pains: [
    { title: "OS atrasada descoberta tarde", text: "O prazo estoura e ninguém percebe até o cliente ligar." },
    { title: "Carga desigual na equipe", text: "Um técnico com 9 OS abertas, outro com 2, no mesmo bairro." },
    { title: "Equipamento que sempre volta", text: "A mesma impressora consertada quatro vezes, quando trocar sairia mais barato." },
    { title: "Relatório que ninguém lê", text: "A secretaria recebe tabelas de números, não a explicação do mês." },
  ],

  shift: {
    from: {
      label: "O caminho óbvio",
      title: "Um chat com IA no painel",
      points: ["O gestor precisa saber o que perguntar", "O uso depende da curiosidade", "Valor difícil de medir"],
    },
    to: {
      label: "A escolha da Agnis",
      title: "Uma fila de decisões",
      points: [
        "A Agnis traz o assunto, com a ação pronta",
        "Aparece toda vez que o painel abre",
        "Medível: sugestões aprovadas e OS atrasadas por semana",
      ],
    },
  },

  flowSection: {
    eyebrow: "Agnis no fluxo do Fire OS",
    title: "Um complemento em cada etapa do atendimento",
    subtitle:
      "O Fire OS já organiza o atendimento do chamado à OS assinada. A Agnis não cria telas paralelas: ela aparece nas etapas que você já usa, começando pela distribuição.",
  },

  flowSteps: [
    { title: "Receber o chamado", phase: "Fase 3", core: false, text: "Sugere tipo, prioridade e atividades padrão." },
    { title: "Distribuir e agendar", phase: "MVP", core: true, text: "Fila de decisões: atrasos, carga desigual, OS sem técnico." },
    { title: "Técnico a caminho", phase: "Depois", core: false, text: "Explica a ordem de visitas calculada pela API de mapas." },
    { title: "Executar no local", phase: "Fase 4", core: false, text: "Casos parecidos e laudo por voz no app." },
    { title: "OS assinada", phase: "Fase 3", core: false, text: "Resumo da OS para o cliente e a secretaria." },
    { title: "Relatórios", phase: "Fase 3", core: false, text: "Relatório mensal explicado em texto, por secretaria." },
  ],

  profiles: [
    {
      role: "Administrador",
      title: "Gestor da operação",
      quote: "Quero chegar de manhã e saber o que está pegando, sem montar planilha.",
      points: ["Fila de decisões no painel", "Aprova reatribuições e urgências", "Histórico de quem aprovou"],
    },
    {
      role: "Técnico",
      title: "Equipe de campo",
      quote: "Quero uma carga justa e saber o que é urgente de verdade.",
      points: ["Só as próprias OS, como hoje", "Carga mais equilibrada", "Depois: laudo por voz e casos parecidos no app"],
    },
    {
      role: "Cliente",
      title: "Área do usuário",
      quote: "Quero entender o que aconteceu no mês, não só receber uma tabela.",
      points: ["Chamados classificados mais rápido", "Menos OS esquecidas", "Relatório do mês explicado em texto"],
    },
  ],

  howSection: {
    eyebrow: "Como funciona",
    title: "Quem faz o quê em cada cartão",
    subtitle: "A IA cuida da linguagem. O código cuida dos fatos e das permissões. Uma pessoa decide.",
  },

  pipeline: [
    { actor: "codigo", title: "Detector", text: "Uma regra encontra a OS fora do prazo." },
    { actor: "codigo", title: "Fato", text: "Números reais em JSON, validados com Zod." },
    { actor: "ia", title: "Agnis redige", text: "Título, explicação e 2 ou 3 ações de uma lista permitida." },
    { actor: "pessoa", title: "Gestor aprova", text: "Um clique, ou ignora por hoje." },
    { actor: "codigo", title: "Executa e audita", text: "Mesma rota do sistema, mesmas permissões, com log." },
  ] as { actor: Actor; title: string; text: string }[],

  actorLabel: { codigo: "Código", ia: "IA", pessoa: "Pessoa" } as Record<Actor, string>,

  fallbackNote: {
    label: "Sem IA",
    text: "Se o provedor de IA cair, o cartão aparece com um texto padrão. A fila continua funcionando.",
  },

  detectorsIntro: "Cada cartão nasce de uma regra escrita em código, nunca de um palpite do modelo.",

  detectors: [
    { name: "OS fora do prazo", rule: "Tempo aberto maior que o SLA da prioridade", actions: ["Reatribuir", "Marcar urgente", "Avisar cliente"] },
    { name: "Técnico sobrecarregado", rule: "OS abertas acima de 1,5× a média da equipe", actions: ["Redistribuir, com técnico sugerido"] },
    { name: "OS sem técnico", rule: "Sem atribuição há mais de X horas", actions: ["Atribuir por carga e região"] },
    { name: "Equipamento recorrente", rule: "Mesmo patrimônio com 3+ OS em 60 dias", actions: ["Recomendar troca", "Laudo para a secretaria"] },
    { name: "Aguardando peça", rule: "Parado nesse status há mais de N dias", actions: ["Cobrar compra", "Avisar cliente"] },
    { name: "Pico de chamados", rule: "Semana acima de 2× a média do cliente", actions: ["Agendar visita preventiva"] },
  ],

  clipsSection: {
    eyebrow: "Protótipos no portal",
    title: "Veja a Agnis em outras telas",
    subtitle:
      "Além da fila e do chat, o portal já tem protótipos da Agnis em relatórios, triagem e roteiro. Gravações reais, com dados fictícios.",
  },

  clips: [
    {
      id: "agnis-insights",
      screen: "Relatório mensal (IA)",
      title: "O mês explicado em texto",
      text: "Os números do período viram um resumo por secretaria, com o que mudou e por quê.",
    },
    {
      id: "agnis-triagem",
      screen: "Triagem de chamados (IA)",
      title: "Chamado novo já classificado",
      text: "Tipo, prioridade e atividades padrão sugeridos para cada chamado que chega.",
    },
    {
      id: "agnis-rota",
      screen: "Roteiro inteligente (IA)",
      title: "A ordem de visitas, explicada",
      text: "A rota calculada pela API de mapas, com o motivo de cada parada em linguagem simples.",
    },
  ] as AgnisClip[],

  principlesSection: {
    eyebrow: "Princípios",
    title: "Seis regras que valem para toda funcionalidade da Agnis",
  },

  principles: [
    { title: "A IA cuida da linguagem, o código cuida dos fatos", text: "Nenhum número sai do modelo. Ele só escreve sobre números calculados pelo sistema." },
    {
      title: "Ferramentas fixas, nunca SQL gerado por IA",
      text: "O modelo escolhe qual função chamar e com quais parâmetros. A consulta é código de sempre.",
      code: "cargaPorTecnico(periodo)",
    },
    { title: "Nenhuma ação sem aprovação humana", text: "Atribuir, redistribuir ou notificar sempre para e espera o clique do gestor." },
    {
      title: "Permissão sempre no backend",
      text: "Cada ferramenta recebe o usuário pelo token, nunca por um argumento do modelo. Um técnico só enxerga as próprias OS.",
    },
    { title: "Toda resposta puxa uma ação", text: "Até uma informação simples vem com pelo menos duas ações possíveis." },
    {
      title: "A ação termina na ferramenta real",
      text: "Quando algo precisa acontecer fora da Agnis, ela entrega o link para a tela certa. Nunca finge que fez.",
    },
  ] as { title: string; text: string; code?: string }[],

  securitySection: {
    eyebrow: "Segurança",
    title: "Seus dados continuam sendo seus",
    subtitle: "A Agnis usa a mesma base, as mesmas permissões e a mesma auditoria do Fire OS.",
  },

  securityItems: [
    {
      title: "Dados sensíveis ficam em casa",
      text: "Nomes, telefones e CPFs nunca vão para o provedor de IA. Há limite de uso por empresa e registro de tokens por chamada.",
    },
    {
      title: "Ação só com aprovação",
      text: "O texto da OS é tratado como dado, nunca como instrução. Nenhuma ação roda sem o clique de uma pessoa.",
    },
    {
      title: "Permissão no backend",
      text: "Cada consulta usa o usuário do token. O técnico continua vendo só as próprias OS, como hoje.",
    },
    {
      title: "Funciona sem IA",
      text: "Provedor trocável e reserva automática. Se a IA cair, os cartões aparecem com texto padrão.",
    },
  ],

  securityExtras: ["Máximo de 7 cartões por dia", "“Não sugerir de novo” contra fadiga de alerta", "Log de quem aprovou e de qual regra"],

  roadmapSection: {
    eyebrow: "Evolução",
    title: "Sete fases, cada uma com critério de saída",
    subtitle: "Só avança quando o critério da fase anterior for cumprido.",
  },

  phases: [
    {
      n: 0,
      title: "Fundação",
      weeks: "1–2 sem",
      text: "Rota de IA no AI SDK v6, provedor trocável (Gemini, Groq, falso), limite de uso e campo de SLA.",
      exit: "Testes de IA passando no CI sem chamar a API",
    },
    {
      n: 1,
      title: "Fila de decisões",
      weeks: "3–4 sem",
      mvp: true,
      text: "Seis detectores, cartões com ações, aprovação e auditoria.",
      exit: "Mais de 40% das sugestões aprovadas por 2 semanas",
    },
    {
      n: 2,
      title: "Pergunte à Agnis",
      weeks: "2–3 sem",
      text: "Chat com as mesmas ferramentas, streaming e histórico curto.",
      exit: "90% das perguntas chamam a ferramenta certa",
    },
    {
      n: 3,
      title: "IA dentro dos fluxos",
      weeks: "3–4 sem",
      text: "Triagem de OS nova e relatório mensal por secretaria.",
      exit: "Triagem acima de 80% de acerto",
    },
    {
      n: 4,
      title: "Memória da operação",
      weeks: "4–6 sem",
      text: "Casos parecidos (RAG) e laudo por voz.",
      exit: "recall@5 acima de 70%",
    },
    {
      n: 5,
      title: "Agente de triagem",
      weeks: "3–4 sem",
      text: "Fluxo com pausa para aprovação e estado salvo no Postgres.",
      exit: "60% das OS novas atribuídas com um clique",
    },
    {
      n: 6,
      title: "Plataforma",
      weeks: "contínuo",
      text: "Observabilidade, avaliações no CI, servidor MCP e multi-tenant.",
      exit: "Para começar: mais de uma empresa pagante",
      exitLabel: "Gatilho",
    },
  ] as { n: number; title: string; weeks: string; mvp?: boolean; text: string; exit: string; exitLabel?: string }[],

  gateNote: "Mostrar a fila para 5 a 10 empresas e buscar 2 ou 3 pilotos antes de seguir.",

  agnisFinal: {
    eyebrow: "Status",
    title: "A Agnis está chegando ao Fire OS.",
    text:
      "As telas já existem como protótipo dentro do sistema. A próxima etapa liga a primeira regra de ponta a ponta: OS fora do prazo, com um cartão, uma ação e auditoria. Quem já usa o Fire OS recebe a Agnis no mesmo painel.",
    primary: { label: "Acessar o portal", path: "/login" },
    secondary: { label: "Conhecer o Fire OS", href: "/" },
    note: "Dados dos exemplos são fictícios.",
  },
};

export type AgnisContent = typeof pt;

const en: AgnisContent = {
  agnisHero: {
    eyebrow: "New in Fire OS · Agnis",
    title: "Open the Fire OS dashboard and know what to decide today.",
    highlight: "what to decide today.",
    lead:
      "Agnis is the assistant built into Fire OS. It reads the tickets, work orders, technicians and equipment you already record, points out what needs attention and gets the action ready in one click.",
    leadStrong: "Nothing to install, nothing new to sign up for.",
    primaryCta: { label: "Try the decision queue", href: "#fila" },
    secondaryCta: { label: "See where it fits in Fire OS", href: "#fluxo" },
    facts: [
      { value: "Inside the dashboard", label: "you already use" },
      { value: "Same 3 roles", label: "same permissions" },
      { value: "1 click", label: "to approve the action" },
    ],
  },

  skipLabel: "Skip today",
  skipAudit: "Skipped today · comes back tomorrow if the rule still applies",

  decisions: [
    {
      id: "atraso",
      severity: "crit",
      chip: "Overdue",
      tool: "chamadosForaDoPrazo",
      title: "WO 48217 is 26 h past the high-priority deadline",
      context: "Carlos has 9 open work orders. Ana has 2 and covers the same neighborhood.",
      actions: [
        { label: "Reassign to Ana", audit: "Reassigned to Ana by a manager at 07:42 · rule: overdue work order", primary: true },
        { label: "Mark urgent", audit: "Marked urgent by a manager at 07:42" },
      ],
    },
    {
      id: "recorrente",
      severity: "warn",
      chip: "Recurring equipment",
      tool: "equipamentosRecorrentes",
      title: "Printer PAT-00412 had 4 work orders in 60 days",
      context: "Three were the same roller fault. Replacing it is likely cheaper.",
      actions: [
        {
          label: "Generate report for the department",
          audit: "Recurrence report generated for the Department of Education · approved by a manager",
          primary: true,
        },
      ],
    },
    {
      id: "pico",
      severity: "info",
      chip: "Ticket spike",
      tool: "chamadosPorCliente",
      title: "Rio Verde School opened 11 tickets this week",
      context: "The average is 4. Eight are network issues in the same building.",
      actions: [
        {
          label: "Schedule a preventive visit",
          audit: "Preventive visit scheduled for Thursday, 09:00 · opens the Technician calendar",
          primary: true,
        },
      ],
    },
  ],

  queueNote:
    "Example with fictitious data. Try the buttons: each approval records who approved it and which rule triggered the suggestion.",

  videoSection: {
    eyebrow: "Real prototype",
    title: "Ask Agnis, inside the dashboard",
    text:
      "A recording of the prototype already running in the Fire OS portal: Agnis answers questions about tickets and technicians with the system's own numbers and suggests the next step.",
    caption: "Ask Agnis — prototype inside the dashboard",
    points: [
      "Answers with data computed by the system, not made up by the model",
      "Every answer ends in a possible action",
      "Respects the role of whoever is asking",
    ],
  },

  whySection: {
    eyebrow: "Why Agnis",
    title: "The data is already in Fire OS. What's missing is time to dig through it.",
    subtitle:
      "Tickets, work orders, technicians and equipment are recorded across many screens. Managers only notice a problem when the customer complains.",
  },

  pains: [
    { title: "Late work orders found too late", text: "The deadline passes and nobody notices until the customer calls." },
    { title: "Uneven workload", text: "One technician with 9 open work orders, another with 2, in the same neighborhood." },
    { title: "Equipment that keeps coming back", text: "The same printer fixed four times, when replacing it would be cheaper." },
    { title: "Reports nobody reads", text: "The department gets tables of numbers, not an explanation of the month." },
  ],

  shift: {
    from: {
      label: "The obvious path",
      title: "An AI chat in the dashboard",
      points: ["Managers need to know what to ask", "Usage depends on curiosity", "Value is hard to measure"],
    },
    to: {
      label: "Agnis's choice",
      title: "A decision queue",
      points: [
        "Agnis brings up the issue, with the action ready",
        "Shows up every time the dashboard opens",
        "Measurable: approved suggestions and late work orders per week",
      ],
    },
  },

  flowSection: {
    eyebrow: "Agnis in the Fire OS flow",
    title: "An add-on at every step of the job",
    subtitle:
      "Fire OS already organizes service from ticket to signed work order. Agnis doesn't add parallel screens: it shows up in the steps you already use, starting with dispatch.",
  },

  flowSteps: [
    { title: "Receive the ticket", phase: "Phase 3", core: false, text: "Suggests type, priority and standard activities." },
    { title: "Dispatch and schedule", phase: "MVP", core: true, text: "Decision queue: delays, uneven workload, unassigned work orders." },
    { title: "Technician on the way", phase: "Later", core: false, text: "Explains the visit order computed by the maps API." },
    { title: "Work on site", phase: "Phase 4", core: false, text: "Similar cases and voice-dictated reports in the app." },
    { title: "Signed work order", phase: "Phase 3", core: false, text: "Work order summary for the customer and the department." },
    { title: "Reports", phase: "Phase 3", core: false, text: "Monthly report explained in plain text, per department." },
  ],

  profiles: [
    {
      role: "Admin",
      title: "Operations manager",
      quote: "I want to come in the morning and know what's wrong, without building a spreadsheet.",
      points: ["Decision queue in the dashboard", "Approves reassignments and urgencies", "History of who approved what"],
    },
    {
      role: "Technician",
      title: "Field crew",
      quote: "I want a fair workload and to know what's truly urgent.",
      points: ["Only their own work orders, as today", "More balanced workload", "Later: voice reports and similar cases in the app"],
    },
    {
      role: "Customer",
      title: "Customer area",
      quote: "I want to understand what happened this month, not just get a table.",
      points: ["Tickets classified faster", "Fewer forgotten work orders", "Monthly report explained in plain text"],
    },
  ],

  howSection: {
    eyebrow: "How it works",
    title: "Who does what in each card",
    subtitle: "AI handles the language. Code handles the facts and permissions. A person decides.",
  },

  pipeline: [
    { actor: "codigo", title: "Detector", text: "A rule finds the overdue work order." },
    { actor: "codigo", title: "Fact", text: "Real numbers in JSON, validated with Zod." },
    { actor: "ia", title: "Agnis writes", text: "Title, explanation and 2 or 3 actions from an allowed list." },
    { actor: "pessoa", title: "Manager approves", text: "One click, or skip for today." },
    { actor: "codigo", title: "Runs and audits", text: "Same system route, same permissions, with a log." },
  ],

  actorLabel: { codigo: "Code", ia: "AI", pessoa: "Person" },

  fallbackNote: {
    label: "No AI",
    text: "If the AI provider goes down, the card shows a default text. The queue keeps working.",
  },

  detectorsIntro: "Every card comes from a rule written in code, never from a guess by the model.",

  detectors: [
    { name: "Overdue work order", rule: "Open longer than the priority's SLA", actions: ["Reassign", "Mark urgent", "Notify customer"] },
    { name: "Overloaded technician", rule: "Open work orders above 1.5× the team average", actions: ["Redistribute, with a suggested technician"] },
    { name: "Unassigned work order", rule: "No assignee for more than X hours", actions: ["Assign by workload and region"] },
    { name: "Recurring equipment", rule: "Same asset with 3+ work orders in 60 days", actions: ["Recommend replacement", "Report for the department"] },
    { name: "Awaiting part", rule: "Stuck in that status for more than N days", actions: ["Chase the purchase", "Notify customer"] },
    { name: "Ticket spike", rule: "Week above 2× the customer's average", actions: ["Schedule a preventive visit"] },
  ],

  clipsSection: {
    eyebrow: "Prototypes in the portal",
    title: "See Agnis on other screens",
    subtitle:
      "Beyond the queue and the chat, the portal already has Agnis prototypes in reports, triage and routing. Real recordings, with fictitious data.",
  },

  clips: [
    {
      id: "agnis-insights",
      screen: "Monthly report (AI)",
      title: "The month explained in text",
      text: "The period's numbers become a summary per department, with what changed and why.",
    },
    {
      id: "agnis-triagem",
      screen: "Ticket triage (AI)",
      title: "New ticket already classified",
      text: "Type, priority and standard activities suggested for every incoming ticket.",
    },
    {
      id: "agnis-rota",
      screen: "Smart routing (AI)",
      title: "The visit order, explained",
      text: "The route computed by the maps API, with the reason for each stop in plain language.",
    },
  ],

  principlesSection: {
    eyebrow: "Principles",
    title: "Six rules that apply to every Agnis feature",
  },

  principles: [
    { title: "AI handles language, code handles facts", text: "No number comes from the model. It only writes about numbers computed by the system." },
    {
      title: "Fixed tools, never AI-generated SQL",
      text: "The model picks which function to call and with which parameters. The query is regular code.",
      code: "cargaPorTecnico(periodo)",
    },
    { title: "No action without human approval", text: "Assigning, redistributing or notifying always stops and waits for the manager's click." },
    {
      title: "Permissions always on the backend",
      text: "Each tool gets the user from the token, never from a model argument. A technician only sees their own work orders.",
    },
    { title: "Every answer leads to an action", text: "Even a simple piece of information comes with at least two possible actions." },
    {
      title: "The action ends in the real tool",
      text: "When something has to happen outside Agnis, it hands over the link to the right screen. It never pretends it did it.",
    },
  ],

  securitySection: {
    eyebrow: "Security",
    title: "Your data stays yours",
    subtitle: "Agnis uses the same database, the same permissions and the same audit trail as Fire OS.",
  },

  securityItems: [
    {
      title: "Sensitive data stays home",
      text: "Names, phone numbers and tax IDs never go to the AI provider. There are usage limits per company and token logs per call.",
    },
    {
      title: "Actions only with approval",
      text: "Work order text is treated as data, never as instructions. No action runs without a person's click.",
    },
    {
      title: "Permissions on the backend",
      text: "Every query uses the user from the token. Technicians still see only their own work orders, as today.",
    },
    {
      title: "Works without AI",
      text: "Swappable provider and automatic fallback. If the AI goes down, cards show a default text.",
    },
  ],

  securityExtras: ["At most 7 cards per day", "“Don't suggest again” against alert fatigue", "Log of who approved and which rule"],

  roadmapSection: {
    eyebrow: "Roadmap",
    title: "Seven phases, each with an exit criterion",
    subtitle: "It only moves on once the previous phase's criterion is met.",
  },

  phases: [
    {
      n: 0,
      title: "Foundation",
      weeks: "1–2 wks",
      text: "AI route on AI SDK v6, swappable provider (Gemini, Groq, fake), usage limits and an SLA field.",
      exit: "AI tests passing in CI without calling the API",
    },
    {
      n: 1,
      title: "Decision queue",
      weeks: "3–4 wks",
      mvp: true,
      text: "Six detectors, cards with actions, approval and audit.",
      exit: "Over 40% of suggestions approved for 2 weeks",
    },
    {
      n: 2,
      title: "Ask Agnis",
      weeks: "2–3 wks",
      text: "Chat with the same tools, streaming and short history.",
      exit: "90% of questions call the right tool",
    },
    {
      n: 3,
      title: "AI inside the flows",
      weeks: "3–4 wks",
      text: "Triage of new work orders and monthly report per department.",
      exit: "Triage above 80% accuracy",
    },
    {
      n: 4,
      title: "Operational memory",
      weeks: "4–6 wks",
      text: "Similar cases (RAG) and voice reports.",
      exit: "recall@5 above 70%",
    },
    {
      n: 5,
      title: "Triage agent",
      weeks: "3–4 wks",
      text: "Flow that pauses for approval, with state saved in Postgres.",
      exit: "60% of new work orders assigned in one click",
    },
    {
      n: 6,
      title: "Platform",
      weeks: "ongoing",
      text: "Observability, evals in CI, MCP server and multi-tenancy.",
      exit: "To start: more than one paying company",
      exitLabel: "Trigger",
    },
  ],

  gateNote: "Show the queue to 5 to 10 companies and land 2 or 3 pilots before moving on.",

  agnisFinal: {
    eyebrow: "Status",
    title: "Agnis is coming to Fire OS.",
    text:
      "The screens already exist as a prototype inside the system. The next step wires the first rule end to end: overdue work orders, with a card, an action and an audit trail. Everyone already using Fire OS gets Agnis in the same dashboard.",
    primary: { label: "Open the portal", path: "/login" },
    secondary: { label: "Discover Fire OS", href: "/" },
    note: "Example data is fictitious.",
  },
};

export const agnisContent: Record<Locale, AgnisContent> = { pt, en };

/** The /agnis copy in the current language (server or client components). */
export function useAgnisContent(): AgnisContent {
  return agnisContent[useAppLocale()];
}
