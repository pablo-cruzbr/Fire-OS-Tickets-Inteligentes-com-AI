"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { laudoTecnicoFields } from "@/features/laudoTecnico/fields";

export default function FormularioLaudoTecnico() {
  const router = useRouter();

  return (
    <FormPage title={ta({ pt: "Novo laudo técnico", en: "New technical report" })} backHref="/dashboard/controles/laudoTecnico" backLabel={ta({ pt: "Laudo técnico", en: "Technical report" })}>
      <EntityForm
        fields={laudoTecnicoFields()}
        request={{ method: "post", url: "/controledelaudotecnico" }}
        submitLabel={ta({ pt: "Enviar solicitação", en: "Send request" })}
        successMessage={ta({ pt: "Laudo técnico registrado!", en: "Technical report recorded!" })}
        onSuccess={() => router.push("/dashboard/controles/laudoTecnico")}
      />
    </FormPage>
  );
}
