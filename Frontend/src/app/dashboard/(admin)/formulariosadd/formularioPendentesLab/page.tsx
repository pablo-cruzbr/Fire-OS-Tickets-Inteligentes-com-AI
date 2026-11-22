"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { maquinaPendenteLabFields } from "@/features/maquinasPendentesLab/fields";

export default function FormularioPendentesLab() {
  const router = useRouter();

  return (
    <FormPage
      title={ta({ pt: "Nova máquina pendente no laboratório", en: "New machine pending in lab" })}
      backHref="/dashboard/controles/pendentesLaboratorio"
      backLabel={ta({ pt: "Pendentes laboratório", en: "Pending in lab" })}
    >
      <EntityForm
        fields={maquinaPendenteLabFields()}
        request={{ method: "post", url: "/controledemaquinaspendenteslab" }}
        submitLabel={ta({ pt: "Cadastrar", en: "Register" })}
        successMessage={ta({ pt: "Máquina pendente cadastrada!", en: "Pending machine added!" })}
        onSuccess={() => router.push("/dashboard/controles/pendentesLaboratorio")}
      />
    </FormPage>
  );
}
