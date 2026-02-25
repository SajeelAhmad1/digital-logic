import prisma from '@/prisma/prisma';
import type * as Prisma from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  isEmail,
  isNameValid,
  isPasswordValid,
} from '../../../utils/validation';
import jwt from 'jsonwebtoken';
import {
  ERROR,
  INCORRECT_OTP,
  PHONE_DOES_NOT_EXIST,
  RESET_PASSWORD_RESPONSE,
  SUCCESS,
  URL_EXPIRED_OR_INVALID,
  VERIFICATION_EMAIL_SENT,
} from '@/constants';
import {
  sendForgetPasswordEmail,
  sendVerificationEmail as sendVerification,
} from '@/server/services/email';
import { getPayload } from '@/server/services/token';
import { adminOnly } from '../../wrappers';
import { getRandomNumber } from '@/utils/generator';

type RegisterUserInput = Prisma.User & { password: string };
export const registerUser = async (_: unknown, args: RegisterUserInput) => {
  const password = args.password;
  const pwHash = await bcrypt.hash(password, 10);

  if (args.email) isEmail(args.email);
  isPasswordValid(args.password);
  isNameValid(args.name || '');

  const { password: _p, ...data } = args;

  return prisma.user.create({
    data: {
      ...data,
      pwHash,
    },
  });
};

type LoginUserInput = { email: string; password: string };
export const login = async (
  _: unknown,
  { email, password }: LoginUserInput
) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return {
      error: 'Incorrect email or password',
    };
  }
  if (
    parseInt(process.env.REQUIRE_EMAIL_VERIFICATION || '') &&
    !user.isEmailVerified
  ) {
    return { error: 'Email is not verified' };
  }
  if (await bcrypt.compare(password, user.pwHash || '')) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    return {
      user,
      token,
    };
  } else {
    return {
      error: 'Incorrect email or password',
    };
  }
};

export const sendResetPasswordLink = async (
  _: unknown,
  { email }: { email: string }
) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    await sendForgetPasswordEmail(email);
  }
  return { message: RESET_PASSWORD_RESPONSE };
};

type ResetPasswordArgs = { token: string; password: string };
export const resetPassword = async (
  _: unknown,
  { token, password }: ResetPasswordArgs
) => {
  const payload = getPayload({ token });
  if (payload?.data?.email) {
    isPasswordValid(password);
    const pwHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: payload?.data?.email },
      data: { pwHash },
    });
    return { status: SUCCESS };
  } else {
    return { status: URL_EXPIRED_OR_INVALID };
  }
};

export const deleteUser = adminOnly(async (_: unknown, { id }) => {
  return prisma.user.delete({ where: { id } });
});
