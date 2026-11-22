"use client";

import { ta } from "@/i18n/active";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TbArrowLeft, TbPhotoPlus, TbTrash } from "react-icons/tb";
import { api } from "@/services/api";
import { apiErrorMessage } from "@/lib/apiError";
import { Button, EmptyState, Spinner } from "@/components/ui";
import type { Foto } from "./helpers";

/** Photos of the OS: list, upload (queued on the API) and delete with confirmation. */
export function OrdemFotos({ ordemId }: { ordemId: string }) {
  const [fotos, setFotos] = useState<Foto[] | null>(null);
  const [selected, setSelected] = useState<Foto | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/foto/${ordemId}`);
      setFotos(Array.isArray(data) ? data : []);
    } catch (error) {
      setFotos([]);
      toast.error(apiErrorMessage(error, ta({ pt: "Não foi possível carregar as fotos.", en: "Couldn't load the photos." })));
    }
  }, [ordemId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("ordemdeServico_id", ordemId);
        // let the browser set the multipart boundary (the instance defaults to JSON)
        await api.post("/foto", formData, { headers: { "Content-Type": undefined } });
      }
      // Upload is processed by a queue worker: the POST only confirms the photo
      // was queued, so reload the list — a photo may only show up a bit later.
      toast.success(ta({ pt: "Fotos enviadas. Elas podem levar alguns segundos para aparecer.", en: "Photos uploaded. They may take a few seconds to appear." }));
      await load();
    } catch (error) {
      toast.error(apiErrorMessage(error, ta({ pt: "Erro ao enviar as fotos.", en: "Couldn't upload the photos." })));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(foto: Foto) {
    if (!window.confirm(ta({ pt: "Excluir esta foto? Essa ação não pode ser desfeita.", en: "Delete this photo? This can't be undone." }))) return;
    setDeleting(true);
    try {
      await api.delete(`/foto/${foto.id}`);
      setFotos((previous) => (previous ?? []).filter((item) => item.id !== foto.id));
      setSelected(null);
      toast.success(ta({ pt: "Foto excluída.", en: "Photo deleted." }));
    } catch (error) {
      toast.error(apiErrorMessage(error, ta({ pt: "Não foi possível excluir a foto.", en: "Couldn't delete the photo." })));
    } finally {
      setDeleting(false);
    }
  }

  if (selected) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelected(null)} icon={<TbArrowLeft className="h-4 w-4" />}>
            {ta({ pt: "Voltar às fotos", en: "Back to photos" })}
          </Button>
          <Button
            variant="lightDanger"
            size="sm"
            loading={deleting}
            onClick={() => handleDelete(selected)}
            icon={<TbTrash className="h-4 w-4" />}
          >
            {ta({ pt: "Excluir foto", en: "Delete photo" })}
          </Button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={selected.url} alt={ta({ pt: "Foto da ordem de serviço", en: "Work order photo" })} className="max-h-[60vh] w-full rounded-lg bg-surface object-contain" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-bodytext">
          {fotos ? ta({ pt: `${fotos.length} foto${fotos.length === 1 ? "" : "s"}`, en: `${fotos.length} photo${fotos.length === 1 ? "" : "s"}` }) : ta({ pt: "Carregando fotos...", en: "Loading photos..." })}
        </p>
        <Button
          size="sm"
          variant="light"
          loading={uploading}
          onClick={() => fileInputRef.current?.click()}
          icon={<TbPhotoPlus className="h-4 w-4" />}
        >
          {uploading ? ta({ pt: "Enviando...", en: "Sending..." }) : ta({ pt: "Adicionar fotos", en: "Add photos" })}
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      {fotos === null ? (
        <div className="flex justify-center py-10 text-primarytext">
          <Spinner />
        </div>
      ) : fotos.length === 0 ? (
        <EmptyState title={ta({ pt: "Nenhuma foto adicionada", en: "No photos added" })} description={ta({ pt: "As fotos enviadas pelo técnico aparecem aqui.", en: "Photos sent by the technician show up here." })} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {fotos.map((foto) => (
            <button
              key={foto.id}
              type="button"
              onClick={() => setSelected(foto)}
              className="group overflow-hidden rounded-lg bg-surface focus-visible:outline-2 focus-visible:outline-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={foto.url}
                alt={ta({ pt: "Foto da ordem de serviço", en: "Work order photo" })}
                className="aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
