// auth/auth-config/useAuth.ts
import { useRouter } from 'next/navigation';
import { useMutation } from 'urql';
import {
  RESET_PASSWORD,
  SEND_RESET_PASSWORD_LINK,
  SIGNIN,
  SIGNUP,
} from './graphqlAuth';
import { AUTH_PROVIDER } from './authProvider';
import toast from 'react-hot-toast';
import { useState } from 'react';
import {
  logoutSB,
  resetPasswordSB,
  sendResetPasswordLinkSB,
  signinSB,
  signinWithFacebookSB,
  signinWithGoogleSB,
  signupSB,
} from './supabaseAuth';
import Cookies from 'js-cookie';
import Signup from '../Signup';

export function useAuth() {
  const router = useRouter();
  const [loadingType, setLoadingType] = useState<
    'signup' | 'signin' | 'forgotPassword' | 'resetPassword' | 'logout' | 'signinWithGoogle' | 'signinWithFacebook' | null
  >(null);

  function handleSuccess(message: string, redirectTo?: string) {
    toast.success(message);
    if (redirectTo) router.push(redirectTo);
  }

  // signup function
  const signup = async (values: any) => {
    try {
      setLoadingType('signup');
      if (AUTH_PROVIDER === 'graphql') {
        // const result = await signupGQL(values);
        // if (result.error) throw result.error;
      } else if (AUTH_PROVIDER === 'supabase') {
        await signupSB(values);
      }
      handleSuccess(
        'Account created successfully! Please check your email for confirmation.',
        '/auth/signup-success'
      );
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong during signup.');
    } finally {
      setLoadingType(null);
    }
  };

  // signin — payload: { username, password }
  const signin = async (values: { username: string; password: string }) => {
  setLoadingType('signin');
  try {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    // Store JWT in cookie or localStorage
    Cookies.set('token', data.token);

    handleSuccess('Logged in successfully.', '/');
  } catch (err: any) {
    toast.error(err?.message || 'Login failed.');
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

  // forgot password
  const forgotPassword = async (values: any) => {
    try {
      setLoadingType('forgotPassword');
      if (AUTH_PROVIDER === 'graphql') {
        // const result = await sendResetPasswordLinkGQL(values);
        // if (result.error) throw result.error;
        handleSuccess(
          'Reset instructions sent to your email (if account exists).',
          '/auth/reset-password'
        );
      } else if (AUTH_PROVIDER === 'supabase') {
        await sendResetPasswordLinkSB(values);
        handleSuccess(
          'Reset instructions sent to your email (if account exists).'
        );
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send reset email.');
    } finally {
      setLoadingType(null);
    }
  };

  // reset password
  const resetPassword = async (tokenOrPayload: any, password?: string) => {
    try {
      setLoadingType('resetPassword');
      if (AUTH_PROVIDER === 'graphql') {
        // await resetPasswordGQL({ token: tokenOrPayload, password });
      } else if (AUTH_PROVIDER === 'supabase') {
        await resetPasswordSB(tokenOrPayload, password);
      }
      handleSuccess(
        'Password reset successfully. Please sign in.',
        '/auth/signin'
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reset password.');
    } finally {
      setLoadingType(null);
    }
  };

  const signinWithGoogle = async () => {
    try {
      setLoadingType('signin');
      await signinWithGoogleSB();
    } catch (err: any) {
      toast.error(err?.message || 'Google Login Failed');
    } finally {
      setLoadingType(null);
    }
  };

  const signinWithFacebook = async () => {
    try {
      setLoadingType('signin');
      await signinWithFacebookSB();
    } catch (err: any) {
      toast.error(err?.message || 'Facebook Login Failed');
    } finally {
      setLoadingType(null);
    }
  };

  return {
    signin,
    loadingSignin: loadingType === 'signin',
    logout,
    loadingLogout: loadingType === 'logout',
    forgotPassword,
    loadingForgotPassword: loadingType === 'forgotPassword',
    resetPassword,
    loadingResetPassword: loadingType === 'resetPassword',
    signinWithGoogle,
    loadingSigninWithGoogle: loadingType === 'signinWithGoogle',
    signinWithFacebook,
    loadingSigninWithFacebook: loadingType === 'signinWithFacebook',
    signup,
    loadingSignup: loadingType === 'signup',
  };
}

