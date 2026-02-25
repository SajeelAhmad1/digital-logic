// auth/auth-config/useAuth.ts
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { logoutSB, signinSB } from './supabaseAuth';

export function useAuth() {
  const router = useRouter();
  const [loadingType, setLoadingType] = useState<
    'signin' | 'logout' | null
  >(null);

  function handleSuccess(message: string, redirectTo?: string) {
    toast.success(message);
    if (redirectTo) router.push(redirectTo);
  }

  // signin — payload: { username, password }
  const signin = async (values: { username: string; password: string }) => {
    try {
      setLoadingType('signin');
      await signinSB(values);
      handleSuccess('Logged in successfully.', '/');
    } catch (err: any) {
      toast.error(err?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoadingType(null);
    }
  };

  const logout = async () => {
    try {
      setLoadingType('logout');
      await logoutSB();
      handleSuccess('Logged out successfully.', '/auth/signin');
    } catch (err: any) {
      toast.error(err?.message || 'Logout failed.');
    } finally {
      setLoadingType(null);
    }
  };

  return {
    signin,
    loadingSignin: loadingType === 'signin',
    logout,
    loadingLogout: loadingType === 'logout',
  };
}