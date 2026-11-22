"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { laboratorioFields } from "@/features/laboratorio/fields";

export default function FormularioLaboratorio() {
  const router = useRouter();

  return (
    <FormPage title={ta({ pt: "Novo registro de laboratório", en: "New lab record" })} backHref="/dashboard/controles/laboratorio" backLabel={ta({ pt: "Laboratório", en: "Repair lab" })}>
      <EntityForm
        fields={laboratorioFields()}
        request={{ method: "post", url: "/controledelaboratorio" }}
        submitLabel={ta({ pt: "Enviar solicitação", en: "Send request" })}
        successMessage={ta({ pt: "Registro de laboratório criado!", en: "Lab record created!" })}
        onSuccess={() => router.push("/dashboard/controles/laboratorio")}
      />
    </FormPage>
  );
}
