"use client";

import { ta } from "@/i18n/active";
import type { Localized } from "@/i18n/text";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TbDeviceDesktopPlus, TbExternalLink, TbFileText, TbPencil } from "react-icons/tb";
import { DetailGrid } from "@/components/data/DetailModal";
import { Button, ButtonLink, Modal, StatusBadge } from "@/components/ui";
import { api } from "@/services/api";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import type { OrdemdeServicoProps } from "@/lib/getOrdemdeServico.type";
import type { EntityModalProps } from "@/features/modalTypes";
import { OrdemAssinatura } from "./OrdemAssinatura";
import { OrdemAtendimento } from "./OrdemAtendimento";
import { OrdemEditForm } from "./OrdemEditForm";
import { OrdemFotos } from "./OrdemFotos";
import { openerPlace, osEquipamento, osPlace } from "./helpers";

type Tab = "detalhes" | "atendimento" | "fotos" | "assinatura";

const TABS: { id: Tab; label: Localized }[] = [
  { id: "detalhes", label: { pt: "Detalhes", en: "Details" } },
  { id: "atendimento", label: { pt: "Atendimento", en: "Service" } },
  { id: "fotos", label: { pt: "Fotos", en: "Photos" } },
  { id: "assinatura", label: { pt: "Assinatura", en: "Signature" } },
];

function Local({ os }: { os: OrdemdeServicoProps }) {
  const place = osPlace(os);
  const opener = openerPlace(os);
  const shown = place ?? opener;
  if (!shown) return <span className="text-muted">{ta({ pt: "Localização não informada", en: "Location not provided" })}</span>;
  return (
    <div>
      <p>{shown.name}</p>
      <p className="mt-0.5 text-xs font-normal text-bodytext">{shown.endereco || ta({ pt: "Endereço não disponível", en: "Address not available" })}</p>
      {place && opener && opener.name !== place.name && (
        <p className="mt-2 text-xs font-normal text-bodytext">{ta({ pt: "Origem da abertura (usuário):", en: "Opened by (user):" })} {opener.name}</p>
      )}
    </div>
  );
}

/** Detail of an OS opened from the ticket list (modalType "OrdemdeServico"). */
export function OrdemModal({ data, onClose }: EntityModalProps<OrdemdeServicoProps>) {
  const router = useRouter();
  const [os, setOs] = useState<OrdemdeServicoProps>(data);
  const [tab, setTab] = useState<Tab>("detalhes");
  const [editing, setEditing] = useState(false);

  async function handleSaved() {
    try {
      const { data: fresh } = await api.get(`/ordemdeservico/${os.id}`);
      if (fresh?.id) setOs(fresh);
    } catch {
      // keep the current data; the list refresh below still picks up the change
    }
    setEditing(false);
    setTab("detalhes");
    router.refresh();
  }

  const title = `OS ${os.numeroOS ? `#${os.numeroOS}` : ""}`.trim();

  return (
    <Modal
      open
      onClose={onClose}
      size="xl"
      title={editing ? ta({ pt: "Atribuir técnico / alterar status", en: "Assign technician / change status" }) : title}
      subtitle={editing ? title : os.tipodeOrdemdeServico?.name ?? ta({ pt: "Ordem de serviço", en: "Work order" })}
      footer={
        editing ? undefined : (
          <>
            <ButtonLink
              href={`/dashboard/ordemdeservico/${os.id}`}
              onClick={onClose}
              variant="ghost"
              icon={<TbExternalLink className="h-4 w-4" />}
            >
              {ta({ pt: "Página da OS", en: "Work order page" })}
            </ButtonLink>
            <Button
              variant="outline"
              onClick={() => window.open(`/os-digital/${os.id}`, "_blank", "noopener")}
              icon={<TbFileText className="h-4 w-4" />}
            >
              {ta({ pt: "OS digital", en: "Digital work order" })}
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("/dashboard/formulariosadd/formularioMaquinas", "_blank", "noopener")}
              icon={<TbDeviceDesktopPlus className="h-4 w-4" />}
            >
              {ta({ pt: "Cadastrar máquina", en: "Add machine" })}
            </Button>
            <Button onClick={() => setEditing(true)} icon={<TbPencil className="h-4 w-4" />}>
              {ta({ pt: "Atribuir / editar", en: "Assign / edit" })}
            </Button>
          </>
        )
      }
    >
      {editing ? (
        <OrdemEditForm os={os} onSaved={handleSaved} onCancel={() => setEditing(false)} />
      ) : (
        <>
          <div role="tablist" aria-label={ta({ pt: "Seções da OS", en: "Work order sections" })} className="-mt-1 mb-5 flex gap-1 overflow-x-auto border-b border-border">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={cn(
                  "-mb-px whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors",
                  tab === item.id
                    ? "border-primary text-primarytext"
                    : "border-transparent text-bodytext hover:text-primarytext",
                )}
              >
                {ta(item.label)}
              </button>
            ))}
          </div>

          {tab === "detalhes" && (
            <DetailGrid
              fields={[
                { label: ta({ pt: "Nº da OS", en: "Work order no." }), value: os.numeroOS },
                { label: ta({ pt: "Tipo", en: "Type" }), value: os.tipodeOrdemdeServico?.name ?? "Não informado" },
                { label: ta({ pt: "Status", en: "Status" }), value: <StatusBadge status={os.statusOrdemdeServico?.name} /> },
                { label: ta({ pt: "Prioridade", en: "Priority" }), value: <StatusBadge status={os.prioridade?.name} /> },
                { label: ta({ pt: "Quem abriu a OS", en: "Who opened the work order" }), value: os.name || "Não informado no formulário" },
                { label: ta({ pt: "Usuário cadastrado", en: "User registered" }), value: os.user?.name },
                { label: ta({ pt: "Tipo de serviço", en: "Service type" }), value: os.tipodeChamado?.name },
                { label: ta({ pt: "Contato no local", en: "On-site contact" }), value: os.nomedoContatoaserProcuradonoLocal },
                { label: ta({ pt: "Técnico responsável", en: "Technician in charge" }), value: os.tecnico?.name ?? "Não atribuído" },
                { label: ta({ pt: "Tarefa", en: "Task" }), value: os.tarefa?.name ?? "Não informada" },
                { label: ta({ pt: "Equipamento", en: "Equipment" }), value: osEquipamento(os) ?? "Não informado" },
                { label: ta({ pt: "Aberta em", en: "Opened on" }), value: formatDateTime(os.created_at) },
                { label: ta({ pt: "Local", en: "Location" }), value: <Local os={os} />, full: true },
                { label: ta({ pt: "Problema", en: "Problem" }), value: os.descricaodoProblemaouSolicitacao || "Não informado", full: true },
              ]}
            />
          )}
          {tab === "atendimento" && <OrdemAtendimento os={os} />}
          {tab === "fotos" && <OrdemFotos ordemId={os.id} />}
          {tab === "assinatura" && <OrdemAssinatura os={os} />}
        </>
      )}
    </Modal>
  );
}
