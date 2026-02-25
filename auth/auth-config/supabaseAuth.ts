// auth/auth-config/supabaseAuth.ts
import { createClient } from '@/lib/supabase/client';
import { usernameToInternalEmail } from '@/lib/supabase/adminClient';

/**
 * Sign in with username + password.
 * We look up the synthetic internal email from the username
 * and pass it to Supabase's signInWithPassword.
 */
export async function signinSB(payload: { username: string; password: string }) {
  const supabase = createClient();
  const email = usernameToInternalEmail(payload.username);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: payload.password,
  });

  if (error) throw error;
  return data;
}

export async function logoutSB() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}

// ── Kept for completeness but not used in this flow ──────────────────────────

export async function signinWithGoogleSB() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
  });
  if (error) throw error;
  return data;
}

export async function signinWithFacebookSB() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
  });
  if (error) throw error;
  return data;
}

export async function sendResetPasswordLinkSB(_email: string) {
  throw new Error('Password reset is managed by the admin.');
}

export async function resetPasswordSB(_token: any, _password?: string) {
  throw new Error('Password reset is managed by the admin.');
}

export async function signupSB(_payload: any) {
  throw new Error('Signup is disabled. Users are created by the admin.');
}

export async function verifyEmailSB(_token: string) {
  return true;
}

export async function verifyOTPSB(_payload: any) {
  return true;
}