"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { maquinaPendenteOroFields } from "@/features/maquinasPendentesOro/fields";

export default function FormularioPendentesOro() {
  const router = useRouter();

  return (
    <FormPage title={ta({ pt: "Nova máquina pendente ORO", en: "New pending ORO machine" })} backHref="/dashboard/controles/pendentesOro" backLabel={ta({ pt: "Pendentes ORO", en: "Pending ORO" })}>
      <EntityForm
        fields={maquinaPendenteOroFields()}
        request={{ method: "post", url: "/controledemaquinaspendentesoro" }}
        submitLabel={ta({ pt: "Cadastrar", en: "Register" })}
        successMessage={ta({ pt: "Máquina pendente cadastrada!", en: "Pending machine added!" })}
        onSuccess={() => router.push("/dashboard/controles/pendentesOro")}
      />
    </FormPage>
  );
}
