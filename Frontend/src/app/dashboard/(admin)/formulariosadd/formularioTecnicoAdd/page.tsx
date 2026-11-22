"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { tecnicoFields } from "@/features/tecnicos/fields";

export default function FormularioTecnicoAdd() {
  const router = useRouter();

  return (
    <FormPage title={ta({ pt: "Novo técnico", en: "New technician" })} backHref="/dashboard/controles/tecnicos" backLabel={ta({ pt: "Técnicos", en: "Technicians" })}>
      <EntityForm
        fields={tecnicoFields()}
        request={{ method: "post", url: "/tecnico" }}
        columns={1}
        submitLabel={ta({ pt: "Cadastrar", en: "Register" })}
        successMessage={ta({ pt: "Técnico cadastrado!", en: "Technician added!" })}
        onSuccess={() => router.push("/dashboard/controles/tecnicos")}
      />
    </FormPage>
  );
}
