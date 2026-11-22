"use client";

import { ta } from "@/i18n/active";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { TbFileDownload, TbPrinter } from "react-icons/tb";
import { Button, EmptyState } from "@/components/ui";
import type { OrdemdeServicoProps } from "@/lib/getOrdemdeServico.type";
import { OSDocument } from "./OSDocument";
import type { Foto } from "./helpers";

const MAX_PDF_BYTES = 4 * 1024 * 1024;

/** Renders the sheet to a paginated A4 PDF (JPEG quality lowered until it fits 4 MB). */
async function downloadPdf(element: HTMLElement, fileName: string) {
  const html2canvas = (await import("html2canvas")).default;
  const { default: JsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 1.5,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
    imageTimeout: 15000,
    onclone: (doc) => {
      // always capture the light version of the sheet
      doc.documentElement.classList.remove("dark");
      doc.querySelectorAll("img").forEach((img) => {
        img.crossOrigin = "anonymous";
      });
    },
  });

  const build = (image: string) => {
    const pdf = new JsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageHeight = (canvas.height * pageWidth) / canvas.width;
    let heightLeft = imageHeight;
    let position = 0;
    pdf.addImage(image, "JPEG", 0, position, pageWidth, imageHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(image, "JPEG", 0, position, pageWidth, imageHeight);
      heightLeft -= pageHeight;
    }
    return pdf;
  };

  let blob: Blob | null = null;
  for (const quality of [0.8, 0.6, 0.4]) {
    blob = build(canvas.toDataURL("image/jpeg", quality)).output("blob");
    if (blob.size <= MAX_PDF_BYTES) break;
  }
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/** Public /os-digital/[id] page: the OS sheet with print and PDF download. */
export function OSDigitalView({ os, fotos }: { os: OrdemdeServicoProps | null; fotos: Foto[] }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  async function handleDownload() {
    if (!sheetRef.current || !os || generating) return;
    setGenerating(true);
    try {
      await downloadPdf(sheetRef.current, `OS-${os.numeroOS ?? os.id}.pdf`);
    } catch {
      toast.error(ta({ pt: "Não foi possível gerar o PDF. Tente imprimir e salvar como PDF.", en: "Couldn't generate the PDF. Try printing and saving as PDF." }));
    } finally {
      setGenerating(false);
    }
  }

  if (!os) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <EmptyState title={ta({ pt: "Ordem de serviço não encontrada", en: "Work order not found" })} description={ta({ pt: "Verifique o link ou faça login para visualizar.", en: "Check the link or sign in to view it." })} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 print:bg-white print:p-0">
      <OSDocument ref={sheetRef} os={os} fotos={fotos} crossOrigin />
      <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-end gap-2 print:hidden">
        <Button variant="surface" onClick={() => window.print()} icon={<TbPrinter className="h-4 w-4" />}>
          {ta({ pt: "Imprimir", en: "Print" })}
        </Button>
        <Button onClick={handleDownload} loading={generating} icon={<TbFileDownload className="h-4 w-4" />}>
          {generating ? ta({ pt: "Gerando PDF...", en: "Generating PDF..." }) : ta({ pt: "Baixar PDF", en: "Download PDF" })}
        </Button>
      </div>
    </main>
  );
}
