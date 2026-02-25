// auth/authSchemas.ts
import { z } from 'zod';

// User login schema — username + password, no email
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

// Admin login schema (same shape, separate form for clarity)
export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

// Schema for admin creating a user
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed.'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
export type CreateUserValues = z.infer<typeof createUserSchema>;