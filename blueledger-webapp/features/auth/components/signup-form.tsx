'use client';

import type { SignupFormData } from '@/features/auth/schemas';
import type { ApiError } from '@/lib/api-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signInGithub } from '@/features/auth/actions';
import { signup } from '@/features/auth/client';
import { signupFormSchema } from '@/features/auth/schemas';

function SignUpForm() {
  const router = useRouter();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: SignupFormData) => {
    const toastId = uuidv4();
    toast.loading('Creating account…', { id: toastId });

    try {
      posthog.capture('sign_up_submit', { method: 'credentials' });

      await signup(data);

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Sign in failed after signup', { id: toastId });
        return;
      }

      toast.success('Account created', { id: toastId });
      router.replace('/auth/verify-email');
    }
    catch (e) {
      const err = e as ApiError<{ error?: string }>;
      if (err.status === 409)
        toast.error('Email already in use', { id: toastId });
      else
        toast.error('Unexpected error, please try again', { id: toastId });
    }
  };

  const signInGithubNoCallback = signInGithub.bind(null, undefined);

  return (
    <Card className="overflow-hidden p-0 rounded-lg">
      <CardContent className="grid p-0 md:grid-cols-2">
        <Form {...form}>
          <div className="p-6 md:p-8">
            <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col items-center text-center gap-2 mb-6">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up for BlueLedger
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Confirm password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? (
                      <>
                        <Loader2 className="animate-spin" />
                        {' '}
                        Creating…
                      </>
                    )
                  : (
                      'Create account'
                    )}
              </Button>
            </form>

            <Separator className="my-6" />

            <form action={signInGithubNoCallback} className="mt-6">
              <Button type="submit" variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    fill="currentColor"
                  />
                </svg>
                Continue with GitHub
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground mt-4">
              Already have an account?
              {' '}
              <Link href="/auth/signin" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
        </Form>

        <div className="bg-muted relative hidden md:block">
          <Image src="/login.png" alt="Sign up" fill className="object-cover" />
        </div>
      </CardContent>
    </Card>
  );
}

export default SignUpForm;
