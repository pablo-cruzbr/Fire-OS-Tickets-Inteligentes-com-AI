import { ReactNode } from "react";
import {
  TbBuildingWarehouse,
  TbCalendarEvent,
  TbCalendarTime,
  TbChartBar,
  TbClipboardCheck,
  TbFileSpreadsheet,
  TbFileText,
  TbFlask,
  TbInbox,
  TbMoon,
  TbPhotoCheck,
  TbReportAnalytics,
  TbRoute,
  TbShieldLock,
  TbShoppingCart,
  TbSignature,
  TbSparkles,
  TbTicket,
  TbTool,
  TbUserCheck,
  TbUsersGroup,
} from "react-icons/tb";

/* Landing copy (pt-BR). Section components import from here. */

export type IconItem = { icon: ReactNode; title: string; text: string };

export const hero = {
  eyebrow: "Software de ordens de serviço e chamados",
  title: "Tudo para organizar e fazer crescer o seu negócio de serviços",
  /** Words of `title` to highlight (e.g. with text-gradient). */
  highlight: "negócio de serviços",
  leadStrong: "Do chamado à OS assinada no local.",
  lead: "Agenda da equipe, controle de equipamentos, laboratório, compras e relatórios em um só sistema.",
  primaryCta: { label: "Acessar o portal", path: "/login" },
  secondaryCta: { label: "Sou cliente, quero abrir um chamado", path: "/AreadeUsuario" },
  checks: ["Área do cliente inclusa", "OS digital com assinatura", "Relatórios em Excel"],
};

/** Floating notification cards shown next to the hero. */
export const heroNotes: IconItem[] = [
  { icon: <TbCalendarTime />, title: "OS agendada", text: "Instalação amanhã às 9h · Mariana" },
  { icon: <TbRoute />, title: "Técnico a caminho", text: "OS #48224 · chegada em 15 min" },
  { icon: <TbSignature />, title: "OS concluída e assinada", text: "Assinada por Sandra O. · há 2 min" },
];

export const workflowSection = {
  eyebrow: "Do começo ao fim",
  title: "Um fluxo para cada etapa do atendimento",
};

export const workflow: IconItem[] = [
  { icon: <TbInbox />, title: "Receba chamados", text: "Clientes abrem chamados pela Área do Usuário, já identificados por empresa e setor." },
  { icon: <TbCalendarTime />, title: "Agende e despache", text: "Defina técnico, prioridade e data. Arraste no calendário para reagendar." },
  { icon: <TbRoute />, title: "Atenda em campo", text: "Acompanhe cada OS: aberta, em deslocamento, em andamento, pausada ou concluída." },
  { icon: <TbTool />, title: "Registre o serviço", text: "Atividades, peças, equipamentos e solução aplicada ficam no histórico." },
  { icon: <TbSignature />, title: "Colete a assinatura", text: "Fotos do atendimento e assinatura do responsável na OS digital." },
  { icon: <TbChartBar />, title: "Analise e exporte", text: "Relatórios por período, cliente ou status, direto para o Excel." },
];

export const highlights = [
  { value: "3 perfis", label: "Administrador, técnico e cliente, cada um com o seu acesso" },
  { value: "1 clique", label: "Para exportar as ordens de serviço filtradas em Excel" },
  { value: "100% digital", label: "OS com fotos, atividades e assinatura, pronta para imprimir" },
];

export const segmentsSection = {
  eyebrow: "Segmentos",
  title: "Feito para quem vive de prestar serviço",
  subtitle: "Veja como a ordem de serviço do Fire OS se adapta ao dia a dia de cada tipo de negócio.",
};

export const featuresSection = {
  eyebrow: "Recursos",
  title: "Tudo o que a sua operação precisa",
};

export const features: IconItem[] = [
  { icon: <TbTicket />, title: "Chamados e tickets", text: "Abertura pelo cliente ou pela equipe, com prioridade e tipo." },
  { icon: <TbClipboardCheck />, title: "Ordens de serviço", text: "Status, técnico, atividades padrão e tempo de atendimento." },
  { icon: <TbCalendarEvent />, title: "Calendário técnico", text: "Agenda mensal e semanal com reagendamento por arrastar." },
  { icon: <TbPhotoCheck />, title: "Fotos e assinatura", text: "Comprovação do serviço anexada à própria OS." },
  { icon: <TbBuildingWarehouse />, title: "Controle de equipamentos", text: "Patrimônio, estabilizadores e máquinas pendentes." },
  { icon: <TbFlask />, title: "Laboratório e laudos", text: "Bancada, assistência autorizada e laudos técnicos." },
  { icon: <TbShoppingCart />, title: "Compras", text: "Solicitações de peças com status de compra e entrega." },
  { icon: <TbFileSpreadsheet />, title: "Relatórios", text: "Exportação em Excel e relatórios por secretaria." },
  { icon: <TbFileText />, title: "Documentação técnica", text: "Procedimentos e informações de cada cliente." },
  { icon: <TbUsersGroup />, title: "Clientes e setores", text: "Empresas, instituições, setores e ramais." },
  { icon: <TbShieldLock />, title: "Perfis de acesso", text: "Cada perfil vê só o que precisa, validado no servidor." },
  { icon: <TbMoon />, title: "Tema claro e escuro", text: "Interface moderna, confortável de dia e de noite." },
];

export const stepsSection = {
  eyebrow: "Como funciona",
  title: "Do chamado à OS assinada em três passos",
};

export const steps: IconItem[] = [
  { icon: <TbTicket />, title: "O cliente abre o chamado", text: "Pela Área do Usuário, com o patrimônio e a descrição do problema." },
  { icon: <TbUserCheck />, title: "A equipe atende", text: "O técnico é designado, se desloca e registra atividades, fotos e solução." },
  { icon: <TbReportAnalytics />, title: "A OS é concluída", text: "O responsável assina, a OS digital fica disponível e entra nos relatórios." },
];

export const agnis = {
  icon: <TbSparkles />,
  title: "Agnis, seu assistente de IA",
  text: "Pergunte sobre chamados, agenda e OS e receba o próximo passo sugerido.",
};

export const finalCta = {
  title: "Pronto para organizar seus atendimentos?",
  text: "Entre no portal administrativo ou abra um chamado pela Área do Usuário.",
  primary: { label: "Acessar o portal", path: "/login" },
  secondary: { label: "Abrir um chamado", path: "/AreadeUsuario" },
};
