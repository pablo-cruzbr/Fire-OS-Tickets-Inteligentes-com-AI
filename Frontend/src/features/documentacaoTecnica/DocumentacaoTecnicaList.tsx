"use client";

import { ta } from "@/i18n/active";
import { TbFileText } from "react-icons/tb";
import { CellTitle, EntityList, optionsFrom } from "@/components/data/EntityList";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { formatDateTime } from "@/lib/format";
import type { DocumentacaoTecnicaProps } from "@/lib/getDocumentacaoTecnica.type";

export default function DocumentacaoTecnicaList({ data }: { data: DocumentacaoTecnicaProps[] }) {
  const { openModal } = useGlobalModal();

  return (
    <EntityList<DocumentacaoTecnicaProps>
      title={ta({ pt: "Documentação técnica", en: "Technical documentation" })}
      breadcrumbs={[{ label: ta({ pt: "Controles", en: "Controls" }) }, { label: ta({ pt: "Documentação técnica", en: "Technical documentation" }) }]}
      items={data}
      rowKey={(doc) => doc.id}
      stats={[{ label: ta({ pt: "Documentos", en: "Documents" }), value: data.length, tone: "primary", icon: <TbFileText /> }]}
      search={{
        placeholder: ta({ pt: "Buscar título, descrição, técnico ou cliente...", en: "Search title, description, technician or customer..." }),
        text: (doc) => [doc.titulo, doc.descricao, doc.tecnico?.name, doc.cliente?.name, doc.instituicaoUnidade?.name],
      }}
      filters={[
        {
          label: ta({ pt: "Técnico", en: "Technician" }),
          options: (items) => optionsFrom(items, (doc) => doc.tecnico?.name),
          match: (doc, value) => doc.tecnico?.name === value,
        },
      ]}
      columns={[
        {
          header: ta({ pt: "Título", en: "Title" }),
          cell: (doc) => (
            <CellTitle
              title={doc.titulo}
              subtitle={doc.descricao && doc.descricao.length > 80 ? `${doc.descricao.slice(0, 80)}…` : doc.descricao}
            />
          ),
        },
        { header: ta({ pt: "Técnico", en: "Technician" }), cell: (doc) => doc.tecnico?.name ?? "—" },
        {
          header: ta({ pt: "Cliente / instituição", en: "Customer / institution" }),
          cell: (doc) => doc.cliente?.name ?? doc.instituicaoUnidade?.name ?? ta({ pt: "Nenhum vínculo", en: "Not linked" }),
        },
        { header: ta({ pt: "Criado em", en: "Created on" }), cell: (doc) => formatDateTime(doc.created_at), className: "whitespace-nowrap" },
      ]}
      add={{ href: "/dashboard/formulariosadd/formularioDocumentacaoTecnica", label: ta({ pt: "Nova documentação", en: "New documentation" }) }}
      onOpen={(doc) => openModal("documentacaoTecnica", doc)}
      remove={{
        request: (doc) => ({ url: `/deletedocumentacaotecnica/${doc.id}`, params: { id: doc.id } }),
        describe: (doc) => doc.titulo,
      }}
      emptyMessage={ta({ pt: "Nenhuma documentação técnica ainda.", en: "No technical documentation yet." })}
    />
  );
}
