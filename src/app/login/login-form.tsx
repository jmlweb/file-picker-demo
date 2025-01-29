'use client';

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { useState } from 'react';

// Define types for better type safety
export type LoginState = {
  error: string | null;
};

export type LoginAction = (
  prevState: LoginState,
  formData: FormData,
) => Promise<LoginState>;

export default function LoginForm({
  loginAction,
}: {
  loginAction: LoginAction;
}) {
  const [formState, formAction, isPending] = useActionState(loginAction, {
    error: null,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form action={formAction}>
      <CardContent className="space-y-4">
        {formState.error && (
          <p aria-live="polite" className="text-sm font-medium text-destructive bg-destructive/5 p-3 rounded-md">
            {formState.error}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </CardFooter>
    </form>
  );
}
