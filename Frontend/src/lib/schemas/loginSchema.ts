import { z } from 'zod';

/* Messages are codes from lib/auth `loginErrors`, translated where they are shown. */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'email_required')
    .email('email_invalid'),
  password: z
    .string()
    .min(1, 'password_required')
    .min(4, 'password_short'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
