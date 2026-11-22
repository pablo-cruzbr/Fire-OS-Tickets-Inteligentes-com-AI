"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { clienteCreateFields } from "@/features/clientes/fields";

export default function FormularioClientesPrivados() {
  const router = useRouter();

  return (
    <FormPage title={ta({ pt: "Novo cliente privado", en: "New private customer" })} backHref="/dashboard/clientesprivados" backLabel={ta({ pt: "Clientes privados", en: "Private customers" })}>
      <EntityForm
        fields={clienteCreateFields()}
        request={{ method: "post", url: "/categorycliente" }}
        submitLabel={ta({ pt: "Cadastrar cliente", en: "Add customer" })}
        successMessage={ta({ pt: "Cliente cadastrado!", en: "Customer added!" })}
        onSuccess={() => router.push("/dashboard/clientesprivados")}
      />
    </FormPage>
  );
}
