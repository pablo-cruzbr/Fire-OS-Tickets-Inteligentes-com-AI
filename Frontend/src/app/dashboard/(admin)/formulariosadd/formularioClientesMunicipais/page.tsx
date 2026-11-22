"use client";

import { ta } from "@/i18n/active";
import { useState } from "react";
import { EntityForm } from "@/components/data/EntityForm";
import { FormPage } from "@/components/data/FormPage";
import { clienteMunicipalFields } from "@/features/clientesMunicipais/fields";

export default function FormularioClientesMunicipais() {
  // The old page stayed here after saving and cleared the form, so several
  // institutions can be registered in a row. Remounting the form resets it.
  const [formKey, setFormKey] = useState(0);

  return (
    <FormPage title={ta({ pt: "Novo cliente municipal", en: "New municipal customer" })} backHref="/dashboard/clientesMunicipais" backLabel={ta({ pt: "Clientes municipais", en: "Municipal customers" })}>
      <EntityForm
        key={formKey}
        fields={clienteMunicipalFields()}
        request={{ method: "post", url: "/categoryintituicao" }}
        submitLabel={ta({ pt: "Cadastrar instituição", en: "Add institution" })}
        successMessage={ta({ pt: "Cliente municipal cadastrado com sucesso!", en: "Municipal customer added successfully!" })}
        onSuccess={() => setFormKey((key) => key + 1)}
      />
    </FormPage>
  );
}
