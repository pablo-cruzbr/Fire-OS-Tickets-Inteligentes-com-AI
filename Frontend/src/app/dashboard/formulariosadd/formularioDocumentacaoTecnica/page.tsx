"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { documentacaoFields } from "@/features/documentacaoTecnica/fields";

export default function FormularioDocumentacaoTecnica() {
  const router = useRouter();

  return (
    <FormPage
      title={ta({ pt: "Nova documentação técnica", en: "New technical documentation" })}
      backHref="/dashboard/documentacaoTecnica"
      backLabel={ta({ pt: "Documentação técnica", en: "Technical documentation" })}
    >
      <EntityForm
        fields={documentacaoFields()}
        request={{ method: "post", url: "/documentacaotecnica" }}
        submitLabel={ta({ pt: "Salvar documentação", en: "Save documentation" })}
        successMessage={ta({ pt: "Documentação criada!", en: "Documentation created!" })}
        onSuccess={() => router.push("/dashboard/documentacaoTecnica")}
      />
    </FormPage>
  );
}
