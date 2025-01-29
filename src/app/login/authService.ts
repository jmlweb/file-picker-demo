import { z } from 'zod';

const envSchema = z.object({
  baseURL: z.string().url(),
  anonKey: z.string().min(1),
});

// TODO: Add refresh_token and expires_in
const accessTokenSchema = z.object({
  access_token: z.string().min(1),
}).transform((data) => data.access_token);

const AuthService = () => {
  const { baseURL, anonKey } = envSchema.parse({
    baseURL: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  });

  async function getToken(email: string, password: string) {
    const response = await fetch(`${baseURL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      body: JSON.stringify({ email, password, gotrue_meta_security: {} }),
      headers: {
        'Content-Type': 'application/json',
        'Apikey': anonKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get token. Status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return accessTokenSchema.parse(data);
  }

  return {
    getToken,
  }
}

const authService = AuthService();
export default authService;