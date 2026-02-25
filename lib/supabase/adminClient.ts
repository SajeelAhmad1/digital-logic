// lib/supabase/adminClient.ts
// Uses service_role key — NEVER import this in client components.
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Supabase requires an email to create a user.
 * Since we use usernames, we derive a synthetic internal email.
 * This is never shown to the user and is only used internally.
 */
export function usernameToInternalEmail(username: string) {
  return `${username.toLowerCase()}@internal.app`;
}