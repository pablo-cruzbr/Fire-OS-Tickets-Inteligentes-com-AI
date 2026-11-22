import { getT } from "@/i18n/server";
import type { Metadata } from "next";
import { serverGet } from "@/lib/serverApi";
import type { OrdemdeServicoProps } from "@/lib/getOrdemdeServico.type";
import type { Foto } from "@/features/ordens/helpers";
import { OSDigitalView } from "@/features/ordens/OSDigitalView";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t({ pt: "Ordem de serviço digital", en: "Digital work order" }) };
}

export default async function OSDigitalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [os, fotos] = await Promise.all([
    serverGet<OrdemdeServicoProps | null>(`/ordemdeservico/${id}`, null),
    serverGet<Foto[]>(`/foto/${id}`, []),
  ]);

  return <OSDigitalView os={os?.id ? os : null} fotos={Array.isArray(fotos) ? fotos : []} />;
}
