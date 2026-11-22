"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { assistenciaTecnicaFields } from "@/features/assistenciaTecnica/fields";

export default function FormularioAssistenciaTecnica() {
  const router = useRouter();

  return (
    <FormPage
      title={ta({ pt: "Nova assistência técnica", en: "New repair service" })}
      backHref="/dashboard/controles/assistenciaTecnica"
      backLabel={ta({ pt: "Assistência técnica", en: "Repair service" })}
    >
      <EntityForm
        fields={assistenciaTecnicaFields()}
        request={{ method: "post", url: "/controledeassistenciatecnica" }}
        submitLabel={ta({ pt: "Enviar solicitação", en: "Send request" })}
        successMessage={ta({ pt: "Assistência técnica registrada!", en: "Repair service recorded!" })}
        onSuccess={() => router.push("/dashboard/controles/assistenciaTecnica")}
      />
    </FormPage>
  );
}
