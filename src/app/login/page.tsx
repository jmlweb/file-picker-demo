import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import LoginForm from './login-form';
import type { LoginState } from './login-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { logoutAction } from '../logoutAction';
import getToken from './get-token';
import { TOKEN_COOKIE } from '@/config/server';

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

    const token = await getToken(email, password);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      error: DEFAULT_CREDENTIALS_ERROR,
    };
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    } else {
      return { error: DEFAULT_CREDENTIALS_ERROR };
    }
  }
}

export default async function Login() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE);

  return !token ? (
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
  ) : (
    <div className="flex min-h-screen flex-col items-center justify-center bg-foreground/5">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Already Logged In
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            You are already logged in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Link href="/" legacyBehavior passHref>
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={logoutAction}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
