import axios from "axios";
import { ta } from "@/i18n/active";

/** Best human-readable message from an API error. */
export function apiErrorMessage(
  error: unknown,
  fallback = ta({ pt: "Não foi possível concluir a operação.", en: "The operation could not be completed." }),
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string; message?: string } | undefined;
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;
    if (!error.response) return ta({ pt: "Sem conexão com o servidor.", en: "No connection to the server." });
  }
  return fallback;
}
