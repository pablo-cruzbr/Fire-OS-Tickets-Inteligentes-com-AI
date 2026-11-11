/*
 * Copy for the /agnis page (pt-BR). Agnis is a module inside Fire OS, still
 * a prototype/MVP: the page says so, and every example uses fictitious data.
 */

export const agnisHero = {
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
};

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

export const SKIP_LABEL = "Ignorar hoje";
export const SKIP_AUDIT = "Ignorado hoje · volta amanhã se a regra continuar valendo";

export const decisions: Decision[] = [
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
];

export const queueNote =
  "Exemplo com dados fictícios. Teste os botões: cada aprovação grava quem aprovou e qual regra originou a sugestão.";

export const videoSection = {
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
};

export const whySection = {
  eyebrow: "Por que a Agnis",
  title: "Os dados já estão no Fire OS. Falta tempo para procurar neles.",
  subtitle:
    "Chamados, OS, técnicos e equipamentos ficam registrados em várias telas do sistema. O gestor só percebe o problema quando o cliente reclama.",
};

export const pains = [
  { title: "OS atrasada descoberta tarde", text: "O prazo estoura e ninguém percebe até o cliente ligar." },
  { title: "Carga desigual na equipe", text: "Um técnico com 9 OS abertas, outro com 2, no mesmo bairro." },
  { title: "Equipamento que sempre volta", text: "A mesma impressora consertada quatro vezes, quando trocar sairia mais barato." },
  { title: "Relatório que ninguém lê", text: "A secretaria recebe tabelas de números, não a explicação do mês." },
];

export const shift = {
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
};

export const flowSection = {
  eyebrow: "Agnis no fluxo do Fire OS",
  title: "Um complemento em cada etapa do atendimento",
  subtitle:
    "O Fire OS já organiza o atendimento do chamado à OS assinada. A Agnis não cria telas paralelas: ela aparece nas etapas que você já usa, começando pela distribuição.",
};

export const flowSteps = [
  { title: "Receber o chamado", phase: "Fase 3", text: "Sugere tipo, prioridade e atividades padrão." },
  { title: "Distribuir e agendar", phase: "MVP", core: true, text: "Fila de decisões: atrasos, carga desigual, OS sem técnico." },
  { title: "Técnico a caminho", phase: "Depois", text: "Explica a ordem de visitas calculada pela API de mapas." },
  { title: "Executar no local", phase: "Fase 4", text: "Casos parecidos e laudo por voz no app." },
  { title: "OS assinada", phase: "Fase 3", text: "Resumo da OS para o cliente e a secretaria." },
  { title: "Relatórios", phase: "Fase 3", text: "Relatório mensal explicado em texto, por secretaria." },
];

export const profiles = [
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
];

export type Actor = "codigo" | "ia" | "pessoa";

export const howSection = {
  eyebrow: "Como funciona",
  title: "Quem faz o quê em cada cartão",
  subtitle: "A IA cuida da linguagem. O código cuida dos fatos e das permissões. Uma pessoa decide.",
};

export const pipeline: { actor: Actor; title: string; text: string }[] = [
  { actor: "codigo", title: "Detector", text: "Uma regra encontra a OS fora do prazo." },
  { actor: "codigo", title: "Fato", text: "Números reais em JSON, validados com Zod." },
  { actor: "ia", title: "Agnis redige", text: "Título, explicação e 2 ou 3 ações de uma lista permitida." },
  { actor: "pessoa", title: "Gestor aprova", text: "Um clique, ou ignora por hoje." },
  { actor: "codigo", title: "Executa e audita", text: "Mesma rota do sistema, mesmas permissões, com log." },
];

export const actorLabel: Record<Actor, string> = { codigo: "Código", ia: "IA", pessoa: "Pessoa" };

export const fallbackNote = {
  label: "Sem IA",
  text: "Se o provedor de IA cair, o cartão aparece com um texto padrão. A fila continua funcionando.",
};

export const detectors = [
  { name: "OS fora do prazo", rule: "Tempo aberto maior que o SLA da prioridade", actions: ["Reatribuir", "Marcar urgente", "Avisar cliente"] },
  { name: "Técnico sobrecarregado", rule: "OS abertas acima de 1,5× a média da equipe", actions: ["Redistribuir, com técnico sugerido"] },
  { name: "OS sem técnico", rule: "Sem atribuição há mais de X horas", actions: ["Atribuir por carga e região"] },
  { name: "Equipamento recorrente", rule: "Mesmo patrimônio com 3+ OS em 60 dias", actions: ["Recomendar troca", "Laudo para a secretaria"] },
  { name: "Aguardando peça", rule: "Parado nesse status há mais de N dias", actions: ["Cobrar compra", "Avisar cliente"] },
  { name: "Pico de chamados", rule: "Semana acima de 2× a média do cliente", actions: ["Agendar visita preventiva"] },
];

export const clipsSection = {
  eyebrow: "Protótipos no portal",
  title: "Veja a Agnis em outras telas",
  subtitle: "Além da fila e do chat, o portal já tem protótipos da Agnis em relatórios, triagem e roteiro. Gravações reais, com dados fictícios.",
};

export const principlesSection = {
  eyebrow: "Princípios",
  title: "Seis regras que valem para toda funcionalidade da Agnis",
};

export const principles = [
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
];

export const securitySection = {
  eyebrow: "Segurança",
  title: "Seus dados continuam sendo seus",
  subtitle: "A Agnis usa a mesma base, as mesmas permissões e a mesma auditoria do Fire OS.",
};

export const securityItems = [
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
];

export const securityExtras = ["Máximo de 7 cartões por dia", "“Não sugerir de novo” contra fadiga de alerta", "Log de quem aprovou e de qual regra"];

export const roadmapSection = {
  eyebrow: "Evolução",
  title: "Sete fases, cada uma com critério de saída",
  subtitle: "Só avança quando o critério da fase anterior for cumprido.",
};

export const phases = [
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
];

export const gateNote = "Mostrar a fila para 5 a 10 empresas e buscar 2 ou 3 pilotos antes de seguir.";

export const agnisFinal = {
  eyebrow: "Status",
  title: "A Agnis está chegando ao Fire OS.",
  text:
    "As telas já existem como protótipo dentro do sistema. A próxima etapa liga a primeira regra de ponta a ponta: OS fora do prazo, com um cartão, uma ação e auditoria. Quem já usa o Fire OS recebe a Agnis no mesmo painel.",
  primary: { label: "Acessar o portal", path: "/login" },
  secondary: { label: "Conhecer o Fire OS", href: "/" },
  note: "Dados dos exemplos são fictícios.",
};
