"use client";

import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { TbArrowRight } from "react-icons/tb";
import { Spinner } from "@/components/ui";
import { cn } from "@/lib/cn";
import { authButton } from "./authStyles";

type AuthButtonProps = ComponentProps<"button"> & { loading?: boolean };

/** Gradient submit button for client-side forms. */
export function AuthButton({ loading, disabled, className, children, type = "submit", ...props }: AuthButtonProps) {
  return (
    <button type={type} disabled={disabled || loading} className={cn(authButton.primary, className)} {...props}>
      {loading ? <Spinner className="h-4 w-4" /> : null}
      {children}
      {!loading && <TbArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
    </button>
  );
}

/** Submit button for server-action forms: shows a spinner while pending. */
export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <AuthButton loading={pending}>{children}</AuthButton>;
}
