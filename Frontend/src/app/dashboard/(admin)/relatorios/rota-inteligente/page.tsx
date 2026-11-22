import { getT } from "@/i18n/server";
import { useT } from "@/i18n/text";
import {
  TbBolt,
  TbBrandGoogleMaps,
  TbClock,
  TbCode,
  TbGasStation,
  TbMapPin,
  TbRoute,
  TbSparkles,
} from "react-icons/tb";
import { Badge, Card, CardHeader, StatGrid } from "@/components/ui";
import { HeroCard } from "@/features/dashboard/HeroCard";

export async function generateMetadata() {
  const t = await getT();
  return { title: t({ pt: "Roteiro Inteligente — Fire OS", en: "Smart Routing — Fire OS" }) };
}

const stats = [
  { label: { pt: "Paradas no dia", en: "Stops today" }, value: 6, tone: "primary" as const, icon: <TbMapPin /> },
  { label: { pt: "Distância otimizada", en: "Optimized distance" }, value: "32 km", tone: "secondary" as const, icon: <TbRoute /> },
  { label: { pt: "Economia de combustível", en: "Fuel savings" }, value: "-12%", tone: "success" as const, icon: <TbGasStation /> },
  { label: { pt: "Tempo total estimado", en: "Estimated total time" }, value: "4h40", tone: "warning" as const, icon: <TbClock /> },
];

const stops = [
  {
    os: "#48224",
    local: { pt: "Secretaria de Educação", en: "Department of Education" },
    endereco: "Rua Sete de Setembro, 194",
    prioridade: "URGENTE" as const,
    chegada: "08:00",
    nota: { pt: "Primeira parada: prioridade urgente e mais próxima do ponto de partida do técnico.", en: "First stop: urgent priority and closest to the technician's starting point." },
  },
  {
    os: "#48210",
    local: "EMEF Monteiro Lobato",
    endereco: "Rua das Palmeiras, 120",
    prioridade: "ALTA" as const,
    chegada: "09:10",
    nota: { pt: "A 1,8 km da parada anterior — fica no caminho antes de seguir para a zona norte.", en: "1.8 km from the previous stop — on the way before heading to the north side." },
  },
  {
    os: "#48238",
    local: "CEU Parque Verde",
    endereco: "Av. Paulista, 910",
    prioridade: "MEDIA" as const,
    chegada: "10:20",
  },
  {
    os: "#48231",
    local: "EMEI Cecília Meireles",
    endereco: "Rua XV de Novembro, 268",
    prioridade: "MEDIA" as const,
    chegada: "11:30",
  },
  {
    os: "#48217",
    local: "UBS Jardim das Flores",
    endereco: "Rua dos Andradas, 342",
    prioridade: "BAIXA" as const,
    chegada: "13:15",
    nota: { pt: "Deixada para depois do almoço por ser a parada mais distante do grupo da manhã.", en: "Left for after lunch because it's the farthest stop from the morning group." },
  },
  {
    os: "#48245",
    local: "UBS Vila Nova",
    endereco: "Av. Brasil, 855",
    prioridade: "BAIXA" as const,
    chegada: "14:20",
  },
];

const prioridadeLabel = {
  URGENTE: { pt: "URGENTE", en: "URGENT" },
  ALTA: { pt: "ALTA", en: "HIGH" },
  MEDIA: { pt: "MÉDIA", en: "MEDIUM" },
  BAIXA: { pt: "BAIXA", en: "LOW" },
};

const prioridadeTone = {
  URGENTE: "error",
  ALTA: "warning",
  MEDIA: "info",
  BAIXA: "neutral",
} as const;

export default function RotaInteligentePage() {
  const t = useT();
  return (
    <div className="flex flex-col gap-6">
      <HeroCard>
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge tone="primary" className="ring-1 ring-inset ring-primary/20">
              <TbSparkles className="mr-1 inline h-3.5 w-3.5" /> {t({ pt: "Roteiro sugerido por IA", en: "AI-suggested route" })}
            </Badge>
            <h1 className="mt-3 text-2xl font-semibold text-link">{t({ pt: "Carlos Souza — hoje, 19/10/2026", en: "Carlos Souza — today, 10/19/2026" })}</h1>
            <p className="mt-1 text-sm text-bodytext">{t({ pt: "6 chamados reorganizados por urgência e proximidade", en: "6 tickets reordered by urgency and proximity" })}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex h-10 items-center gap-2 rounded-md bg-card px-4 text-sm font-medium text-link shadow-md">
              <TbBrandGoogleMaps className="h-4 w-4 text-primarytext" /> {t({ pt: "Abrir no Google Maps", en: "Open in Google Maps" })}
            </button>
          </div>
        </div>
      </HeroCard>

      <div className="rounded-lg border border-warning/30 bg-lightwarning px-4 py-3 text-sm text-warningtext">
        <strong className="font-semibold">{t({ pt: "Protótipo de interface:", en: "Interface prototype:" })}</strong> {t({ pt: "a ordem das paradas abaixo é fixa, só para visualizar o layout. Na implementação real, quem calcula a rota é uma API de mapas (Google Directions, com otimização de paradas) e um critério de prioridade em código — a IA só escreve a explicação em português, ela não faz essa conta.", en: "the order of the stops below is fixed, just to preview the layout. In the real implementation, the route is computed by a maps API (Google Directions, with stop optimization) and a priority rule in code — the AI only writes the explanation, it doesn't do that math." })}
      </div>

      <StatGrid stats={stats.map((stat) => ({ ...stat, label: t(stat.label) }))} />

      <Card>
        <CardHeader
          title={t({ pt: "Por que essa ordem?", en: "Why this order?" })}
          subtitle={t({ pt: "O que entrou na conta, e o que não foi a IA quem calculou", en: "What went into the calculation, and what the AI did not compute" })}
        />
        <ul className="flex flex-col gap-3 text-sm text-bodytext">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primarytext">
              <TbCode className="h-4 w-4" />
            </span>
            <span>
              <strong className="text-link">{t({ pt: "1. Prioridade primeiro:", en: "1. Priority first:" })}</strong> {t({ pt: "chamados urgentes e de alta prioridade são sempre posicionados antes dos de prioridade média/baixa, não importa a distância.", en: "urgent and high-priority tickets always come before medium/low priority ones, regardless of distance." })}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primarytext">
              <TbCode className="h-4 w-4" />
            </span>
            <span>
              <strong className="text-link">{t({ pt: "2. Dentro de cada faixa de prioridade:", en: "2. Within each priority band:" })}</strong> {t({ pt: "a ordem é a que minimiza a distância total percorrida (problema de roteirização — resolvido por uma API de mapas, não pela IA).", en: "the order is the one that minimizes the total distance traveled (a routing problem — solved by a maps API, not by the AI)." })}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lightprimary text-primarytext">
              <TbSparkles className="h-4 w-4" />
            </span>
            <span>
              <strong className="text-link">{t({ pt: "3. Só então a IA entra:", en: "3. Only then does AI step in:" })}</strong> {t({ pt: "ela recebe a lista já ordenada e escreve a nota explicando cada escolha em português — ela não decide a ordem, só a traduz em linguagem natural.", en: "it receives the already-sorted list and writes a note explaining each choice — it doesn't decide the order, it only puts it into natural language." })}
            </span>
          </li>
        </ul>
      </Card>

      <Card>
        <CardHeader title={t({ pt: "Paradas do dia", en: "Today's stops" })} subtitle={t({ pt: "Na ordem sugerida", en: "In the suggested order" })} />
        <ol className="flex flex-col gap-4">
          {stops.map((stop, index) => (
            <li key={stop.os} className="flex gap-4 rounded-lg border border-border p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-link">
                      {stop.os} · {t(stop.local)}
                    </p>
                    <p className="text-sm text-bodytext">{stop.endereco}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={prioridadeTone[stop.prioridade]}>{t(prioridadeLabel[stop.prioridade])}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <TbClock className="h-3.5 w-3.5" /> {stop.chegada}
                    </span>
                  </div>
                </div>
                {stop.nota && (
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-primarytext">
                    <TbBolt className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {t(stop.nota)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
