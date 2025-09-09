import ForgotPasswordForm from '@/features/auth/components/forgot-password-form';

export default async function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm md:max-w-3xl mx-auto">
      <ForgotPasswordForm />
    </div>
  );
}
