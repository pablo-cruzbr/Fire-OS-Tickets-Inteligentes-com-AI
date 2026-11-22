"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { setorFields } from "@/features/setores/fields";

export default function FormularioSetores() {
  const router = useRouter();

  return (
    <FormPage title={ta({ pt: "Novo setor", en: "New department" })} backHref="/dashboard/setor" backLabel={ta({ pt: "Setores", en: "Departments" })}>
      <EntityForm
        fields={setorFields()}
        request={{ method: "post", url: "/categorysetor" }}
        submitLabel={ta({ pt: "Cadastrar setor", en: "Add department" })}
        successMessage={ta({ pt: "Setor cadastrado!", en: "Department added!" })}
        columns={1}
        onSuccess={() => router.push("/dashboard/setor")}
      />
    </FormPage>
  );
}
