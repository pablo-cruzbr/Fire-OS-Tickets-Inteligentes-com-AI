"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { equipamentoFields } from "@/features/equipamentos/fields";

export default function FormularioMaquinas() {
  const router = useRouter();

  return (
    <FormPage title={ta({ pt: "Novo equipamento", en: "New equipment" })} backHref="/dashboard/controles/equipamentos" backLabel={ta({ pt: "Equipamentos", en: "Equipment" })}>
      <EntityForm
        fields={equipamentoFields()}
        request={{ method: "post", url: "/equipamento" }}
        submitLabel={ta({ pt: "Cadastrar", en: "Register" })}
        successMessage={ta({ pt: "Equipamento cadastrado!", en: "Equipment added!" })}
        onSuccess={() => router.push("/dashboard/controles/equipamentos")}
      />
    </FormPage>
  );
}
