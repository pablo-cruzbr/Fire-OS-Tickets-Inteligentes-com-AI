"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { ramalSetorFields } from "@/features/ramaisSetores/fields";

export default function FormularioRamaisSetores() {
  const router = useRouter();

  return (
    <FormPage title={ta({ pt: "Novo ramal", en: "New extension" })} backHref="/dashboard/ramaisSetores" backLabel={ta({ pt: "Ramais e setores", en: "Extensions and departments" })}>
      <EntityForm
        fields={ramalSetorFields()}
        request={{ method: "post", url: "/informacoessetor" }}
        submitLabel={ta({ pt: "Cadastrar ramal", en: "Add extension" })}
        successMessage={ta({ pt: "Ramal cadastrado!", en: "Extension added!" })}
        onSuccess={() => router.push("/dashboard/ramaisSetores")}
      />
    </FormPage>
  );
}
