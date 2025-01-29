import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import LoginForm from './login-form';
import type { LoginState } from './login-form';
import authService from './authService';

const DEFAULT_CREDENTIALS_ERROR =
  'Invalid email or password. Please check your credentials and try again.';

// Define validation schema
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().trim().min(1, 'Password is required'),
});

async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  'use server';

  let redirectPath: string | null = null;

  try {
    const result = loginSchema.safeParse({
      email: formData.get('email')?.toString() || '',
      password: formData.get('password')?.toString() || '',
    });

    if (!result.success) {
      return { error: DEFAULT_CREDENTIALS_ERROR };
    }

    const { email, password } = result.data;

    // In real app, this would be an API call to validate credentials
    const token = await authService.getToken(email, password);
    if (!token) {
      return { error: DEFAULT_CREDENTIALS_ERROR };
    }

    // Set auth token and redirect on success
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    redirectPath = '/';
  } catch (error) {
    // in a real app, we should log the error to a monitoring service
    console.error('Login error:', error);
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-foreground/5">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            Enter your email and password to log in.
          </CardDescription>
        </CardHeader>
        <LoginForm loginAction={loginAction} />
      </Card>
    </div>
  );
}
