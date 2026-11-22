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
import type { Text } from "@/i18n/text";

/* Landing copy in Portuguese and English. Section components import from here and pick with useT(). */

export type IconItem = { icon: ReactNode; title: Text; text: Text };

export const hero = {
  eyebrow: { pt: "Software de ordens de serviço e chamados", en: "Service order and ticketing software" },
  title: {
    pt: "Tudo para organizar e fazer crescer o seu negócio de serviços",
    en: "Everything you need to organize and grow your service business",
  },
  /** Words of `title` to highlight (e.g. with text-gradient). */
  highlight: { pt: "negócio de serviços", en: "service business" },
  leadStrong: { pt: "Do chamado à OS assinada no local.", en: "From ticket to work order signed on site." },
  lead: {
    pt: "Agenda da equipe, controle de equipamentos, laboratório, compras e relatórios em um só sistema.",
    en: "Team scheduling, equipment tracking, repair lab, purchasing and reports in one system.",
  },
  primaryCta: { label: { pt: "Acessar o portal", en: "Open the portal" }, path: "/login" },
  secondaryCta: { label: { pt: "Sou cliente, quero abrir um chamado", en: "I'm a customer, open a ticket" }, path: "/AreadeUsuario" },
  checks: [
    { pt: "Área do cliente inclusa", en: "Customer area included" },
    { pt: "OS digital com assinatura", en: "Digital work order with signature" },
    { pt: "Relatórios em Excel", en: "Excel reports" },
  ],
};

/** Floating notification cards shown next to the hero. */
export const heroNotes: IconItem[] = [
  {
    icon: <TbCalendarTime />,
    title: { pt: "OS agendada", en: "Work order scheduled" },
    text: { pt: "Instalação amanhã às 9h · Mariana", en: "Installation tomorrow at 9 AM · Mariana" },
  },
  {
    icon: <TbRoute />,
    title: { pt: "Técnico a caminho", en: "Technician on the way" },
    text: { pt: "OS #48224 · chegada em 15 min", en: "WO #48224 · arriving in 15 min" },
  },
  {
    icon: <TbSignature />,
    title: { pt: "OS concluída e assinada", en: "Work order completed and signed" },
    text: { pt: "Assinada por Sandra O. · há 2 min", en: "Signed by Sandra O. · 2 min ago" },
  },
];

export const workflowSection = {
  eyebrow: { pt: "Do começo ao fim", en: "From start to finish" },
  title: { pt: "Um fluxo para cada etapa do atendimento", en: "A flow for every step of the job" },
};

export const workflow: IconItem[] = [
  {
    icon: <TbInbox />,
    title: { pt: "Receba chamados", en: "Receive tickets" },
    text: {
      pt: "Clientes abrem chamados pela Área do Usuário, já identificados por empresa e setor.",
      en: "Customers open tickets in the Customer Area, already tagged by company and department.",
    },
  },
  {
    icon: <TbCalendarTime />,
    title: { pt: "Agende e despache", en: "Schedule and dispatch" },
    text: {
      pt: "Defina técnico, prioridade e data. Arraste no calendário para reagendar.",
      en: "Set the technician, priority and date. Drag on the calendar to reschedule.",
    },
  },
  {
    icon: <TbRoute />,
    title: { pt: "Atenda em campo", en: "Work in the field" },
    text: {
      pt: "Acompanhe cada OS: aberta, em deslocamento, em andamento, pausada ou concluída.",
      en: "Track every work order: open, on the way, in progress, paused or completed.",
    },
  },
  {
    icon: <TbTool />,
    title: { pt: "Registre o serviço", en: "Log the service" },
    text: {
      pt: "Atividades, peças, equipamentos e solução aplicada ficam no histórico.",
      en: "Activities, parts, equipment and the fix applied stay in the history.",
    },
  },
  {
    icon: <TbSignature />,
    title: { pt: "Colete a assinatura", en: "Collect the signature" },
    text: {
      pt: "Fotos do atendimento e assinatura do responsável na OS digital.",
      en: "Job photos and the customer's signature on the digital work order.",
    },
  },
  {
    icon: <TbChartBar />,
    title: { pt: "Analise e exporte", en: "Analyze and export" },
    text: {
      pt: "Relatórios por período, cliente ou status, direto para o Excel.",
      en: "Reports by period, customer or status, straight to Excel.",
    },
  },
];

export const highlights: { value: Text; label: Text }[] = [
  {
    value: { pt: "3 perfis", en: "3 roles" },
    label: { pt: "Administrador, técnico e cliente, cada um com o seu acesso", en: "Admin, technician and customer, each with their own access" },
  },
  {
    value: { pt: "1 clique", en: "1 click" },
    label: { pt: "Para exportar as ordens de serviço filtradas em Excel", en: "To export the filtered work orders to Excel" },
  },
  {
    value: { pt: "100% digital", en: "100% digital" },
    label: { pt: "OS com fotos, atividades e assinatura, pronta para imprimir", en: "Work orders with photos, activities and signature, ready to print" },
  },
];

export const segmentsSection = {
  eyebrow: { pt: "Segmentos", en: "Industries" },
  title: { pt: "Feito para quem vive de prestar serviço", en: "Built for businesses that live on service" },
  subtitle: {
    pt: "Veja como a ordem de serviço do Fire OS se adapta ao dia a dia de cada tipo de negócio.",
    en: "See how Fire OS work orders adapt to the day-to-day of each kind of business.",
  },
};

export const featuresSection = {
  eyebrow: { pt: "Recursos", en: "Features" },
  title: { pt: "Tudo o que a sua operação precisa", en: "Everything your operation needs" },
};

export const features: IconItem[] = [
  { icon: <TbTicket />, title: { pt: "Chamados e tickets", en: "Tickets" }, text: { pt: "Abertura pelo cliente ou pela equipe, com prioridade e tipo.", en: "Opened by the customer or the team, with priority and type." } },
  { icon: <TbClipboardCheck />, title: { pt: "Ordens de serviço", en: "Work orders" }, text: { pt: "Status, técnico, atividades padrão e tempo de atendimento.", en: "Status, technician, standard activities and service time." } },
  { icon: <TbCalendarEvent />, title: { pt: "Calendário técnico", en: "Technician calendar" }, text: { pt: "Agenda mensal e semanal com reagendamento por arrastar.", en: "Monthly and weekly schedule with drag-to-reschedule." } },
  { icon: <TbPhotoCheck />, title: { pt: "Fotos e assinatura", en: "Photos and signature" }, text: { pt: "Comprovação do serviço anexada à própria OS.", en: "Proof of service attached to the work order itself." } },
  { icon: <TbBuildingWarehouse />, title: { pt: "Controle de equipamentos", en: "Equipment tracking" }, text: { pt: "Patrimônio, estabilizadores e máquinas pendentes.", en: "Asset tags, voltage stabilizers and pending machines." } },
  { icon: <TbFlask />, title: { pt: "Laboratório e laudos", en: "Repair lab and reports" }, text: { pt: "Bancada, assistência autorizada e laudos técnicos.", en: "Bench work, authorized service and technical reports." } },
  { icon: <TbShoppingCart />, title: { pt: "Compras", en: "Purchasing" }, text: { pt: "Solicitações de peças com status de compra e entrega.", en: "Parts requests with purchase and delivery status." } },
  { icon: <TbFileSpreadsheet />, title: { pt: "Relatórios", en: "Reports" }, text: { pt: "Exportação em Excel e relatórios por secretaria.", en: "Excel exports and reports by department." } },
  { icon: <TbFileText />, title: { pt: "Documentação técnica", en: "Technical documentation" }, text: { pt: "Procedimentos e informações de cada cliente.", en: "Procedures and details for each customer." } },
  { icon: <TbUsersGroup />, title: { pt: "Clientes e setores", en: "Customers and departments" }, text: { pt: "Empresas, instituições, setores e ramais.", en: "Companies, institutions, departments and extensions." } },
  { icon: <TbShieldLock />, title: { pt: "Perfis de acesso", en: "Access roles" }, text: { pt: "Cada perfil vê só o que precisa, validado no servidor.", en: "Each role sees only what it needs, enforced on the server." } },
  { icon: <TbMoon />, title: { pt: "Tema claro e escuro", en: "Light and dark theme" }, text: { pt: "Interface moderna, confortável de dia e de noite.", en: "A modern interface, comfortable day and night." } },
];

export const stepsSection = {
  eyebrow: { pt: "Como funciona", en: "How it works" },
  title: { pt: "Do chamado à OS assinada em três passos", en: "From ticket to signed work order in three steps" },
};

export const steps: IconItem[] = [
  { icon: <TbTicket />, title: { pt: "O cliente abre o chamado", en: "The customer opens a ticket" }, text: { pt: "Pela Área do Usuário, com o patrimônio e a descrição do problema.", en: "In the Customer Area, with the asset tag and a description of the problem." } },
  { icon: <TbUserCheck />, title: { pt: "A equipe atende", en: "The team takes the job" }, text: { pt: "O técnico é designado, se desloca e registra atividades, fotos e solução.", en: "A technician is assigned, travels on site and logs activities, photos and the fix." } },
  { icon: <TbReportAnalytics />, title: { pt: "A OS é concluída", en: "The work order is closed" }, text: { pt: "O responsável assina, a OS digital fica disponível e entra nos relatórios.", en: "The customer signs, the digital work order is available and goes into the reports." } },
];

export const agnis = {
  icon: <TbSparkles />,
  title: { pt: "Agnis, seu assistente de IA", en: "Agnis, your AI assistant" },
  text: {
    pt: "Pergunte sobre chamados, agenda e OS e receba o próximo passo sugerido.",
    en: "Ask about tickets, schedules and work orders and get the suggested next step.",
  },
};

export const finalCta = {
  title: { pt: "Pronto para organizar seus atendimentos?", en: "Ready to organize your service calls?" },
  text: {
    pt: "Entre no portal administrativo ou abra um chamado pela Área do Usuário.",
    en: "Sign in to the admin portal or open a ticket in the Customer Area.",
  },
  primary: { label: { pt: "Acessar o portal", en: "Open the portal" }, path: "/login" },
  secondary: { label: { pt: "Abrir um chamado", en: "Open a ticket" }, path: "/AreadeUsuario" },
};
