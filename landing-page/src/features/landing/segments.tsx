import { ReactNode } from "react";
import {
  TbAirConditioning,
  TbBolt,
  TbBug,
  TbCamera,
  TbCar,
  TbDeviceDesktop,
  TbDeviceMobile,
  TbDroplet,
  TbHammer,
  TbSolarPanel,
  TbSpray,
  TbTools,
  TbWifi,
} from "react-icons/tb";
import type { Text } from "@/i18n/text";

export type Segment = {
  id: string;
  name: Text;
  short: Text;
  icon: ReactNode;
  /** Photo in /public/segments (CC0, see CREDITS.md there). */
  image?: string;
  description: Text;
  records: Text[];
  /** Example service order shown in the preview card. */
  example: {
    title: Text;
    client: Text;
    lines: { label: Text; value: Text }[];
    status: Text;
  };
};

/* Shared labels/statuses used across the example cards. */
const L = {
  diagnosis: { pt: "Diagnóstico", en: "Diagnosis" },
  parts: { pt: "Peças", en: "Parts" },
  labor: { pt: "Mão de obra", en: "Labor" },
  technician: { pt: "Técnico", en: "Technician" },
  material: { pt: "Material", en: "Material" },
  equipment: { pt: "Equipamento", en: "Equipment" },
  priority: { pt: "Prioridade", en: "Priority" },
  team: { pt: "Equipe", en: "Crew" },
  duration: { pt: "Duração", en: "Duration" },
  high: { pt: "Alta", en: "High" },
  in90days: { pt: "Em 90 dias", en: "In 90 days" },
};
const S = {
  inProgress: { pt: "Em andamento", en: "In progress" },
  scheduled: { pt: "Agendada", en: "Scheduled" },
  completed: { pt: "Concluída", en: "Completed" },
  open: { pt: "Aberta", en: "Open" },
};

export const segments: Segment[] = [
  {
    id: "oficinas",
    name: { pt: "Oficinas mecânicas e automotivas", en: "Auto repair shops" },
    short: { pt: "Oficinas", en: "Auto repair" },
    icon: <TbCar />,
    description: {
      pt: "Registre o diagnóstico, as peças trocadas e a mão de obra de cada veículo, com histórico por placa e aprovação do orçamento pelo cliente.",
      en: "Log the diagnosis, replaced parts and labor for each vehicle, with history by license plate and customer approval of the estimate.",
    },
    records: [
      { pt: "Diagnóstico e checklist de entrada do veículo", en: "Diagnosis and vehicle check-in checklist" },
      { pt: "Peças trocadas (óleo, filtros, pastilhas de freio...)", en: "Replaced parts (oil, filters, brake pads...)" },
      { pt: "Horas de mão de obra por mecânico", en: "Labor hours per mechanic" },
      { pt: "Histórico de serviços por placa e quilometragem", en: "Service history by plate and mileage" },
    ],
    example: {
      title: { pt: "Revisão dos 40.000 km", en: "40,000 km service" },
      client: "Fiat Argo · ABC-1D23",
      lines: [
        { label: L.diagnosis, value: { pt: "Ruído na frenagem", en: "Noise when braking" } },
        { label: L.parts, value: { pt: "Óleo 5W30, filtro, pastilhas", en: "5W30 oil, filter, pads" } },
        { label: L.labor, value: "2h30 · Carlos" },
      ],
      status: S.inProgress,
    },
  },
  {
    id: "assistencia",
    name: { pt: "Assistência técnica de eletrodomésticos e eletrônicos", en: "Appliance and electronics repair" },
    short: { pt: "Assistência técnica", en: "Electronics repair" },
    icon: <TbDeviceMobile />,
    description: {
      pt: "Controle a entrada de celulares, notebooks e TVs para conserto: estado do aparelho, defeito relatado, laudo técnico e prazo de retirada.",
      en: "Track phones, laptops and TVs coming in for repair: device condition, reported fault, technical report and pickup date.",
    },
    records: [
      { pt: "Entrada do aparelho com nº de série e acessórios", en: "Device check-in with serial number and accessories" },
      { pt: "Defeito relatado e laudo técnico", en: "Reported fault and technical report" },
      { pt: "Controle de bancada: aguardando peça, em conserto, pronto", en: "Bench tracking: awaiting part, in repair, ready" },
      { pt: "Termo de retirada assinado pelo cliente", en: "Pickup receipt signed by the customer" },
    ],
    example: {
      title: { pt: "Notebook não liga", en: "Laptop won't turn on" },
      client: "Dell Inspiron 15 · SN 88A1-X",
      lines: [
        { label: { pt: "Acessórios", en: "Accessories" }, value: { pt: "Carregador", en: "Charger" } },
        { label: { pt: "Laudo", en: "Report" }, value: { pt: "Troca do conector DC", en: "Replace DC jack" } },
        { label: { pt: "Prazo", en: "Due" }, value: { pt: "3 dias úteis", en: "3 business days" } },
      ],
      status: { pt: "Aguardando peça", en: "Awaiting part" },
    },
  },
  {
    id: "climatizacao",
    name: { pt: "Climatização e refrigeração", en: "HVAC and refrigeration" },
    short: { pt: "Climatização", en: "HVAC" },
    icon: <TbAirConditioning />,
    description: {
      pt: "Organize instalações, PMOC e manutenções preventivas de ar-condicionado e câmaras frias, com agenda de visitas e fotos do serviço.",
      en: "Organize installations, maintenance plans and preventive maintenance for air conditioners and cold rooms, with visit scheduling and service photos.",
    },
    records: [
      { pt: "Instalação, higienização e manutenção preventiva", en: "Installation, cleaning and preventive maintenance" },
      { pt: "Equipamentos por cliente, com BTUs e local", en: "Equipment per customer, with BTUs and location" },
      { pt: "Agenda recorrente de visitas (PMOC)", en: "Recurring visit schedule (maintenance plan)" },
      { pt: "Fotos de antes e depois e assinatura no local", en: "Before and after photos and on-site signature" },
    ],
    example: {
      title: { pt: "Higienização split 12.000 BTUs", en: "12,000 BTU split unit cleaning" },
      client: { pt: "Clínica Bem Estar · Sala 2", en: "Bem Estar Clinic · Room 2" },
      lines: [
        { label: { pt: "Tipo", en: "Type" }, value: { pt: "Manutenção preventiva", en: "Preventive maintenance" } },
        { label: L.technician, value: "Mariana Lima" },
        { label: { pt: "Próxima visita", en: "Next visit" }, value: L.in90days },
      ],
      status: S.scheduled,
    },
  },
  {
    id: "marcenaria",
    name: { pt: "Marcenaria e móveis planejados", en: "Carpentry and custom furniture" },
    short: { pt: "Marcenaria", en: "Carpentry" },
    icon: <TbHammer />,
    description: {
      pt: "Acompanhe cada projeto da medição à montagem: materiais, etapas de produção, equipe de instalação e ajustes pós-entrega.",
      en: "Follow each project from measuring to assembly: materials, production stages, installation crew and post-delivery adjustments.",
    },
    records: [
      { pt: "Medição e projeto aprovado pelo cliente", en: "Measurements and design approved by the customer" },
      { pt: "Materiais e ferragens utilizados", en: "Materials and hardware used" },
      { pt: "Etapas: corte, montagem, acabamento, instalação", en: "Stages: cutting, assembly, finishing, installation" },
      { pt: "Assistência pós-entrega e garantia", en: "Post-delivery support and warranty" },
    ],
    example: {
      title: { pt: "Cozinha planejada", en: "Custom kitchen" },
      client: { pt: "Apto 142 · Residencial Aurora", en: "Apt 142 · Aurora Residences" },
      lines: [
        { label: L.material, value: { pt: "MDF branco 18mm", en: "White MDF 18mm" } },
        { label: { pt: "Etapa", en: "Stage" }, value: { pt: "Montagem na fábrica", en: "Factory assembly" } },
        { label: { pt: "Instalação", en: "Installation" }, value: { pt: "Sexta, 08h", en: "Friday, 8 AM" } },
      ],
      status: { pt: "Em produção", en: "In production" },
    },
  },
  {
    id: "helpdesk",
    name: { pt: "Suporte de TI (Helpdesk)", en: "IT support (Helpdesk)" },
    short: { pt: "Suporte de TI", en: "IT support" },
    icon: <TbDeviceDesktop />,
    description: {
      pt: "Abertura de chamados para correção de bugs, configuração de servidores ou formatação de máquinas, com controle de patrimônio e documentação técnica por cliente.",
      en: "Tickets for bug fixes, server setup or machine reinstalls, with asset tracking and technical documentation per customer.",
    },
    records: [
      { pt: "Chamados abertos pelo próprio usuário, com prioridade", en: "Tickets opened by users themselves, with priority" },
      { pt: "Bugs, configurações de servidor e formatações", en: "Bugs, server configuration and reinstalls" },
      { pt: "Patrimônio, laboratório e histórico de cada máquina", en: "Asset tags, repair lab and history of each machine" },
      { pt: "Documentação técnica e senhas por cliente", en: "Technical documentation and passwords per customer" },
    ],
    example: {
      title: { pt: "Formatação e reinstalação", en: "Wipe and reinstall" },
      client: { pt: "Secretaria de Educação · Diretoria", en: "Department of Education · Board" },
      lines: [
        { label: { pt: "Patrimônio", en: "Asset tag" }, value: "PAT-20426" },
        { label: L.priority, value: L.high },
        { label: L.technician, value: "Rafael Pereira" },
      ],
      status: S.inProgress,
    },
  },
  {
    id: "telecom",
    name: { pt: "Provedores de internet e telecom", en: "Internet providers and telecom" },
    short: { pt: "Internet e telecom", en: "Internet and telecom" },
    icon: <TbWifi />,
    description: {
      pt: "OS de campo para instalação de fibra óptica, troca de roteadores ou reparo de sinal, com agenda da equipe técnica e comprovação no local.",
      en: "Field work orders for fiber installation, router swaps or signal repair, with crew scheduling and on-site proof.",
    },
    records: [
      { pt: "Instalação de fibra com dados do plano e da CTO", en: "Fiber installation with plan and splice box details" },
      { pt: "Troca de roteador/ONU com nº de série", en: "Router/ONT swap with serial number" },
      { pt: "Reparo de sinal com medição antes e depois", en: "Signal repair with before and after readings" },
      { pt: "Assinatura do assinante e fotos da instalação", en: "Subscriber signature and installation photos" },
    ],
    example: {
      title: { pt: "Instalação de fibra 500 Mb", en: "500 Mb fiber installation" },
      client: { pt: "Assinante · Rua XV de Novembro, 88", en: "Subscriber · 88 XV de Novembro St." },
      lines: [
        { label: { pt: "CTO / porta", en: "Splice box / port" }, value: { pt: "CTO-14 · porta 6", en: "CTO-14 · port 6" } },
        { label: L.equipment, value: { pt: "ONU Wi-Fi 6", en: "Wi-Fi 6 ONT" } },
        { label: { pt: "Sinal", en: "Signal" }, value: "-19 dBm" },
      ],
      status: { pt: "Em deslocamento", en: "On the way" },
    },
  },
  {
    id: "eletrica",
    name: { pt: "Elétrica e manutenção predial", en: "Electrical and building maintenance" },
    short: { pt: "Elétrica e predial", en: "Electrical" },
    icon: <TbBolt />,
    description: {
      pt: "Gerencie manutenções corretivas e preventivas em condomínios, empresas e prédios públicos, com checklists e registro de materiais.",
      en: "Manage corrective and preventive maintenance in condos, companies and public buildings, with checklists and material logs.",
    },
    records: [
      { pt: "Checklist de inspeção por local", en: "Inspection checklist per site" },
      { pt: "Materiais aplicados em cada atendimento", en: "Materials used on each job" },
      { pt: "Chamados por bloco, andar e setor", en: "Tickets by building, floor and area" },
      { pt: "Relatórios mensais para o síndico ou gestor", en: "Monthly reports for the property manager" },
    ],
    example: {
      title: { pt: "Troca de disjuntor geral", en: "Main breaker replacement" },
      client: { pt: "Condomínio Parque Verde · Bloco B", en: "Parque Verde Condos · Building B" },
      lines: [
        { label: L.material, value: { pt: "Disjuntor tripolar 63A", en: "63A three-pole breaker" } },
        { label: { pt: "Local", en: "Location" }, value: { pt: "Quadro do 3º andar", en: "3rd floor panel" } },
        { label: L.duration, value: "1h15" },
      ],
      status: S.completed,
    },
  },
  {
    id: "hidraulica",
    name: { pt: "Hidráulica e encanamento", en: "Plumbing" },
    short: { pt: "Hidráulica", en: "Plumbing" },
    icon: <TbDroplet />,
    description: {
      pt: "Da detecção do vazamento ao reparo: registre o problema, os materiais, fotos da obra e a aprovação do cliente em uma só OS.",
      en: "From leak detection to repair: log the problem, materials, job photos and customer approval in a single work order.",
    },
    records: [
      { pt: "Diagnóstico com fotos do local", en: "Diagnosis with on-site photos" },
      { pt: "Orçamento aprovado antes da execução", en: "Estimate approved before the work" },
      { pt: "Materiais e tempo de serviço", en: "Materials and service time" },
      { pt: "Garantia registrada na OS", en: "Warranty recorded on the work order" },
    ],
    example: {
      title: { pt: "Vazamento sob a pia", en: "Leak under the sink" },
      client: { pt: "Padaria Pão Dourado", en: "Pão Dourado Bakery" },
      lines: [
        { label: { pt: "Causa", en: "Cause" }, value: { pt: "Sifão trincado", en: "Cracked P-trap" } },
        { label: L.material, value: { pt: "Sifão sanfonado", en: "Flexible P-trap" } },
        { label: { pt: "Garantia", en: "Warranty" }, value: { pt: "90 dias", en: "90 days" } },
      ],
      status: S.completed,
    },
  },
  {
    id: "seguranca",
    name: { pt: "Segurança eletrônica (CFTV e alarmes)", en: "Security systems (CCTV and alarms)" },
    short: { pt: "Segurança eletrônica", en: "Security systems" },
    icon: <TbCamera />,
    description: {
      pt: "Instale e mantenha câmeras, alarmes e controle de acesso com cadastro de equipamentos por cliente e visitas técnicas agendadas.",
      en: "Install and maintain cameras, alarms and access control with equipment records per customer and scheduled service visits.",
    },
    records: [
      { pt: "Projeto e pontos de câmera instalados", en: "Layout and installed camera points" },
      { pt: "Equipamentos por cliente (DVR, sensores...)", en: "Equipment per customer (DVR, sensors...)" },
      { pt: "Manutenções e visitas técnicas", en: "Maintenance and service visits" },
      { pt: "Chamados de emergência com prioridade", en: "Priority emergency tickets" },
    ],
    example: {
      title: { pt: "Câmera sem imagem", en: "Camera with no image" },
      client: { pt: "Mercado São Jorge · Estoque", en: "São Jorge Market · Stockroom" },
      lines: [
        { label: L.equipment, value: { pt: "Câmera IP 4MP", en: "4MP IP camera" } },
        { label: L.priority, value: L.high },
        { label: { pt: "Visita", en: "Visit" }, value: { pt: "Hoje, 14h", en: "Today, 2 PM" } },
      ],
      status: S.open,
    },
  },
  {
    id: "solar",
    name: { pt: "Energia solar", en: "Solar energy" },
    short: { pt: "Energia solar", en: "Solar" },
    icon: <TbSolarPanel />,
    description: {
      pt: "Controle vistorias, instalações e limpezas de placas com histórico por usina e fotos de cada etapa.",
      en: "Track surveys, installations and panel cleanings with history per site and photos of each stage.",
    },
    records: [
      { pt: "Vistoria técnica e dimensionamento", en: "Site survey and system sizing" },
      { pt: "Instalação por etapas com fotos", en: "Staged installation with photos" },
      { pt: "Limpeza e manutenção periódica", en: "Periodic cleaning and maintenance" },
      { pt: "Histórico por usina e inversor", en: "History per site and inverter" },
    ],
    example: {
      title: { pt: "Limpeza de módulos", en: "Panel cleaning" },
      client: { pt: "Sítio Boa Vista · 24 placas", en: "Boa Vista Farm · 24 panels" },
      lines: [
        { label: { pt: "Inversor", en: "Inverter" }, value: "5 kW" },
        { label: L.team, value: { pt: "2 técnicos", en: "2 technicians" } },
        { label: { pt: "Próxima", en: "Next" }, value: { pt: "Em 6 meses", en: "In 6 months" } },
      ],
      status: S.scheduled,
    },
  },
  {
    id: "dedetizacao",
    name: { pt: "Dedetização e controle de pragas", en: "Pest control" },
    short: { pt: "Dedetização", en: "Pest control" },
    icon: <TbBug />,
    description: {
      pt: "Registre produtos aplicados, áreas tratadas e o certificado de execução, com retornos programados para cada cliente.",
      en: "Log products applied, treated areas and the service certificate, with scheduled follow-ups for each customer.",
    },
    records: [
      { pt: "Produtos e dosagens aplicadas", en: "Products and doses applied" },
      { pt: "Áreas tratadas por visita", en: "Areas treated per visit" },
      { pt: "Certificado e assinatura do responsável", en: "Certificate and customer signature" },
      { pt: "Retornos e garantias agendados", en: "Scheduled follow-ups and warranties" },
    ],
    example: {
      title: { pt: "Desinsetização trimestral", en: "Quarterly insect treatment" },
      client: "Restaurante Sabor & Cia",
      lines: [
        { label: { pt: "Produto", en: "Product" }, value: { pt: "Gel inseticida", en: "Insecticide gel" } },
        { label: { pt: "Áreas", en: "Areas" }, value: { pt: "Cozinha e estoque", en: "Kitchen and storage" } },
        { label: { pt: "Retorno", en: "Follow-up" }, value: L.in90days },
      ],
      status: S.completed,
    },
  },
  {
    id: "limpeza",
    name: { pt: "Limpeza e conservação", en: "Cleaning and janitorial" },
    short: { pt: "Limpeza", en: "Cleaning" },
    icon: <TbSpray />,
    description: {
      pt: "Planeje equipes, roteiros e checklists de limpeza para empresas e residências, com comprovação por fotos.",
      en: "Plan crews, routes and cleaning checklists for businesses and homes, with photo proof.",
    },
    records: [
      { pt: "Checklist por ambiente", en: "Checklist per room" },
      { pt: "Escala de equipes e roteiros", en: "Crew rosters and routes" },
      { pt: "Fotos de comprovação", en: "Proof photos" },
      { pt: "Avaliação do cliente ao final", en: "Customer rating at the end" },
    ],
    example: {
      title: { pt: "Limpeza pós-obra", en: "Post-construction cleaning" },
      client: { pt: "Escritório Almeida & Costa", en: "Almeida & Costa Office" },
      lines: [
        { label: L.team, value: { pt: "3 pessoas", en: "3 people" } },
        { label: { pt: "Ambientes", en: "Rooms" }, value: { pt: "6 salas", en: "6 rooms" } },
        { label: L.duration, value: "5h" },
      ],
      status: S.inProgress,
    },
  },
  {
    id: "serralheria",
    name: { pt: "Serralheria e manutenção geral", en: "Metalwork and general repairs" },
    short: { pt: "Serralheria e reparos", en: "Metalwork and repairs" },
    icon: <TbTools />,
    description: {
      pt: "Portões, grades, estruturas e pequenos reparos: orçamento, execução e entrega registrados na mesma ordem de serviço.",
      en: "Gates, railings, structures and small repairs: estimate, execution and delivery recorded on the same work order.",
    },
    records: [
      { pt: "Medição e orçamento", en: "Measurements and estimate" },
      { pt: "Materiais e acabamento", en: "Materials and finish" },
      { pt: "Agenda de instalação", en: "Installation schedule" },
      { pt: "Fotos da entrega", en: "Delivery photos" },
    ],
    example: {
      title: { pt: "Portão basculante", en: "Overhead gate" },
      client: { pt: "Residência · Rua das Palmeiras", en: "Residence · Palmeiras St." },
      lines: [
        { label: { pt: "Serviço", en: "Service" }, value: { pt: "Troca de roldanas", en: "Pulley replacement" } },
        { label: L.material, value: { pt: "Kit roldana 4\"", en: "4\" pulley kit" } },
        { label: { pt: "Entrega", en: "Delivery" }, value: { pt: "Amanhã", en: "Tomorrow" } },
      ],
      status: S.open,
    },
  },
];

const photos = new Set([
  "oficinas",
  "assistencia",
  "climatizacao",
  "marcenaria",
  "helpdesk",
  "telecom",
  "eletrica",
  "hidraulica",
  "seguranca",
  "solar",
  "limpeza",
  "serralheria",
]);

segments.forEach((segment) => {
  if (photos.has(segment.id)) segment.image = `/segments/${segment.id}.webp`;
});
