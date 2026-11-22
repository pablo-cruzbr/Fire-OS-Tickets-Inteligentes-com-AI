import { ReactNode } from "react";
import {
  TbAddressBook,
  TbBuildingCommunity,
  TbCalendarEvent,
  TbFileText,
  TbLayoutDashboard,
  TbSettingsAutomation,
  TbSparkles,
  TbSquarePlus,
  TbTicket,
  TbTool,
  TbUsersGroup,
} from "react-icons/tb";
import type { Text } from "@/i18n/text";
import type { Role } from "@/lib/session";

export type NavLink = { label: Text; href: string };

export type NavItem = {
  label: Text;
  icon: ReactNode;
  href?: string;
  children?: NavLink[];
};

export type NavSection = {
  heading: Text;
  roles: Role[];
  items: NavItem[];
};

export const navigation: NavSection[] = [
  {
    heading: { pt: "Principal", en: "Main" },
    roles: ["ADMIN", "TECNICO"],
    items: [
      { label: { pt: "Painel", en: "Dashboard" }, icon: <TbLayoutDashboard />, href: "/dashboard" },
      {
        label: { pt: "Chamados", en: "Tickets" },
        icon: <TbTicket />,
        children: [
          { label: { pt: "Lista de chamados", en: "Ticket list" }, href: "/dashboard/tickets" },
          { label: { pt: "Abrir um ticket", en: "Open a ticket" }, href: "/dashboard/formulariosadd/formularioTicket" },
          { label: { pt: "Abrir uma OS", en: "Open a work order" }, href: "/dashboard/formulariosadd/formularioOrdemdeServico" },
        ],
      },
      { label: { pt: "Documentação técnica", en: "Technical documentation" }, icon: <TbFileText />, href: "/dashboard/documentacaoTecnica" },
    ],
  },
  {
    heading: { pt: "Administração", en: "Administration" },
    roles: ["ADMIN"],
    items: [
      { label: { pt: "Calendário técnico", en: "Technician calendar" }, icon: <TbCalendarEvent />, href: "/dashboard/ticketscount" },
      { label: { pt: "Relatório mensal (IA)", en: "Monthly report (AI)" }, icon: <TbSparkles />, href: "/dashboard/relatorios/insights" },
      { label: { pt: "Roteiro inteligente (IA)", en: "Smart routing (AI)" }, icon: <TbSparkles />, href: "/dashboard/relatorios/rota-inteligente" },
      { label: { pt: "Triagem de chamados (IA)", en: "Ticket triage (AI)" }, icon: <TbSparkles />, href: "/dashboard/relatorios/triagem-ia" },
      {
        label: { pt: "Controles", en: "Controls" },
        icon: <TbSettingsAutomation />,
        children: [
          { label: { pt: "Equipamentos", en: "Equipment" }, href: "/dashboard/controles/equipamentos" },
          { label: { pt: "Estabilizadores", en: "Voltage stabilizers" }, href: "/dashboard/controles/estabilizadores" },
          { label: { pt: "Assistência técnica", en: "Repair service" }, href: "/dashboard/controles/assistenciaTecnica" },
          { label: { pt: "Laudo técnico", en: "Technical reports" }, href: "/dashboard/controles/laudoTecnico" },
          { label: { pt: "Laboratório", en: "Repair lab" }, href: "/dashboard/controles/laboratorio" },
          { label: { pt: "Pendentes laboratório", en: "Pending in lab" }, href: "/dashboard/controles/pendentesLaboratorio" },
          { label: { pt: "Pendentes ORO", en: "Pending ORO" }, href: "/dashboard/controles/pendentesOro" },
          { label: { pt: "Compras", en: "Purchasing" }, href: "/dashboard/compras" },
        ],
      },
      {
        label: { pt: "Clientes", en: "Customers" },
        icon: <TbBuildingCommunity />,
        children: [
          { label: { pt: "Clientes privados", en: "Private customers" }, href: "/dashboard/clientesprivados" },
          { label: { pt: "Clientes municipais", en: "Municipal customers" }, href: "/dashboard/clientesMunicipais" },
        ],
      },
      {
        label: { pt: "Ramais e setores", en: "Extensions and departments" },
        icon: <TbAddressBook />,
        children: [
          { label: { pt: "Ramais e setores", en: "Extensions and departments" }, href: "/dashboard/ramaisSetores" },
          { label: { pt: "Setores", en: "Departments" }, href: "/dashboard/setor" },
        ],
      },
      { label: { pt: "Técnicos", en: "Technicians" }, icon: <TbTool />, href: "/dashboard/controles/tecnicos" },
      { label: { pt: "Usuários", en: "Users" }, icon: <TbUsersGroup />, href: "/dashboard/usuarios" },
      {
        label: { pt: "Cadastros", en: "New records" },
        icon: <TbSquarePlus />,
        children: [
          { label: { pt: "Novo ramal", en: "New extension" }, href: "/dashboard/formulariosadd/formularioRamaisSetores" },
          { label: { pt: "Novo equipamento", en: "New equipment" }, href: "/dashboard/formulariosadd/formularioMaquinas" },
          { label: { pt: "Novo técnico", en: "New technician" }, href: "/dashboard/formulariosadd/formularioTecnicoAdd" },
          { label: { pt: "Novo setor", en: "New department" }, href: "/dashboard/formulariosadd/formularioSetores" },
          { label: { pt: "Novo usuário", en: "New user" }, href: "/signup_empresa" },
        ],
      },
    ],
  },
];

export function navigationFor(role: Role) {
  return navigation.filter((section) => section.roles.includes(role));
}
