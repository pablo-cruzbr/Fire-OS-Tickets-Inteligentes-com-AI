"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { novoEstabilizadorFields } from "@/features/estabilizadores/fields";

export default function FormularioEstabilizadorAdd() {
  const router = useRouter();

  return (
    <FormPage
      title={ta({ pt: "Cadastro de estabilizador", en: "Stabilizer registration" })}
      description={ta({ pt: "Registra um novo aparelho para ser usado nos controles de estabilizadores.", en: "Registers a new device to be used in the stabilizer controls." })}
      backHref="/dashboard/controles/estabilizadores"
      backLabel={ta({ pt: "Estabilizadores", en: "Stabilizers" })}
    >
      <EntityForm
        fields={novoEstabilizadorFields()}
        request={{ method: "post", url: "/equipamento/esbilizadores" }}
        submitLabel={ta({ pt: "Cadastrar", en: "Register" })}
        successMessage={ta({ pt: "Estabilizador cadastrado!", en: "Stabilizer added!" })}
        onSuccess={() => router.push("/dashboard/controles/estabilizadores")}
      />
    </FormPage>
  );
}
