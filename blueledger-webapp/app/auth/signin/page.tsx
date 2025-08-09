import SignInForm from '@/features/auth/signin-form';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let callbackUrl = (await searchParams).callbackUrl;
  callbackUrl = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;

  if (!callbackUrl)
    callbackUrl = '/dashboard';

  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
