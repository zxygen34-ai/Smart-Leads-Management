import { z } from 'zod';

const passwordSchema = z.string().min(8).max(128);

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: passwordSchema
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: passwordSchema
  })
});

export const seedAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: passwordSchema
  })
});
