import { activeLocale } from "@/i18n/active";

export type Tone = "primary" | "secondary" | "success" | "warning" | "error" | "info" | "neutral";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

/** Picks a badge colour from a free-text status name coming from the API. */
export function statusTone(name?: string | null): Tone {
  if (!name) return "neutral";
  const status = normalize(name);

  if (/(CONCLU|FINALIZ|ENTREGUE|RESOLVID|ATIV|DISPONIVEL|OK\b|APROVAD|PRONTO)/.test(status)) return "success";
  if (/(CANCEL|RECUS|DEFEIT|INATIV|ERRO|URGENTE|ALTA|CRITIC|REPROV)/.test(status)) return "error";
  if (/(ANDAMENTO|DESLOCAMENTO|REPARO|EM USO|EXECU)/.test(status)) return "primary";
  if (/(AGUARD|PENDENT|ABERT|RESERV|MEDIA|ANALISE)/.test(status)) return "warning";
  if (/(BAIXA)/.test(status)) return "info";
  return "secondary";
}

/** Relations sometimes arrive as `{ name }` and sometimes as a plain string. */
export function relationName(value: unknown, fallback = "—"): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object" && "name" in value && typeof value.name === "string") return value.name;
  return fallback;
}

/*
 * English names for the status / priority values the API sends in Portuguese
 * (keyed by the accent-free, upper-case name). Unknown values are shown as is.
 */
const englishNames: Record<string, string> = {
  ABERTA: "Open",
  ABERTO: "Open",
  "EM ANDAMENTO": "In progress",
  "EM DESLOCAMENTO": "On the way",
  "EM EXECUCAO": "In progress",
  PAUSADA: "Paused",
  PAUSADO: "Paused",
  CONCLUIDA: "Completed",
  CONCLUIDO: "Completed",
  FINALIZADA: "Finished",
  FINALIZADO: "Finished",
  CANCELADA: "Canceled",
  CANCELADO: "Canceled",
  PENDENTE: "Pending",
  "PENDENTE ORO": "Pending ORO",
  "AGUARDANDO COMPRA": "Awaiting purchase",
  "AGUARDANDO CONSERTO": "Awaiting repair",
  "AGUARDANDO DEVOLUCAO": "Awaiting return",
  "AGUARDANDO ENTREGA": "Awaiting delivery",
  "AGUARDANDO OS DE LABORATORIO": "Awaiting lab work order",
  "AGUARDANDO REPARO": "Awaiting repair",
  "AGUARDANDO RETIRADA": "Awaiting pickup",
  "AGUARDANDO PECA": "Awaiting part",
  "COMPRA FINALIZADA": "Purchase completed",
  "REPARO FINALIZADO": "Repair finished",
  "EM MANUTENCAO": "Under maintenance",
  DESCARTADA: "Discarded",
  DISPONIVEL: "Available",
  INSTALADA: "Installed",
  SUBSTITUTA: "Replacement",
  "EM USO": "In use",
  URGENTE: "Urgent",
  ALTA: "High",
  MEDIA: "Medium",
  BAIXA: "Low",
};

/** Display name for a status/priority coming from the API, in the current language. */
export function statusLabel(name: string): string {
  if (activeLocale() !== "en") return name;
  return englishNames[normalize(name).trim()] ?? name;
}
