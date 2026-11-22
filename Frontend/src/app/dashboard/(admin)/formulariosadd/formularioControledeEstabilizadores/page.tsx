"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { controleEstabilizadorFields } from "@/features/estabilizadores/fields";

export default function FormularioControledeEstabilizadores() {
  const router = useRouter();

  return (
    <FormPage
      title={ta({ pt: "Novo controle de estabilizador", en: "New stabilizer control" })}
      backHref="/dashboard/controles/estabilizadores"
      backLabel={ta({ pt: "Estabilizadores", en: "Stabilizers" })}
    >
      <EntityForm
        fields={controleEstabilizadorFields()}
        request={{ method: "post", url: "/controledeestabilizadores" }}
        submitLabel={ta({ pt: "Enviar solicitação", en: "Send request" })}
        successMessage={ta({ pt: "Solicitação enviada com sucesso!", en: "Request sent successfully!" })}
        onSuccess={() => router.push("/dashboard/controles/estabilizadores")}
      />
    </FormPage>
  );
}
