"use client";

import { ta } from "@/i18n/active";
import { useRouter } from "next/navigation";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { compraFields } from "@/features/compras/fields";

export default function FormularioCompras() {
  const router = useRouter();

  return (
    <FormPage title={ta({ pt: "Nova solicitação de compra", en: "New purchase request" })} backHref="/dashboard/compras" backLabel={ta({ pt: "Compras", en: "Purchasing" })}>
      <EntityForm
        fields={compraFields()}
        request={{ method: "post", url: "/solicitacaodecompras" }}
        submitLabel={ta({ pt: "Enviar solicitação", en: "Send request" })}
        successMessage={ta({ pt: "Solicitação enviada!", en: "Request sent!" })}
        onSuccess={() => router.push("/dashboard/compras")}
      />
    </FormPage>
  );
}
