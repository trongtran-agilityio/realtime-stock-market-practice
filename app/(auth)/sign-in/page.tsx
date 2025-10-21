'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * SignIn component handles user authentication through email/password
 */
const SignIn = () => {
  // Router hook for navigation after successful login
  const router = useRouter();

  // Initialize form handling with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur', // Validate on blur for better UX
  });

  /**
   * Handle form submission
   * @param data Contains email and password from the form
   */
  const onSubmit = async (data: SignInFormData) => {
    try {
      // Attempt to sign in user with provided credentials
      const result = await signInWithEmail(data);
      if (result?.success) {
        // Redirect to home page on successful login
        router.replace('/');
        router.refresh();
      } else {
        // Display error message if login fails
        toast.error('Sign in failed', {
          description: result?.error ?? 'Failed to sign in.'
        })
      }

    } catch (e) {
      // Handle unexpected errors during sign in
      console.error(e);
      toast.error('Sign in failed', {
        description: e instanceof Error ? e.message : 'Failed to sign in.'
      });
    }
  };

  return (
    <>
      <h1 className="form-title">Welcome back</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email input field with validation */}
        <InputField
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
          register={register}
          error={errors.email}
          validation={{
            required: 'Email is required.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address."
            }
          }}
        />

        {/* Password input field with validation */}
        <InputField
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: 'Password is required.' }}
        />

        {/* Submit button with loading state */}
        <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
          {isSubmitting ? 'Signing in' : 'Sign In'}
        </Button>

        {/* Link to sign up page for new users */}
        <FooterLink text="Don't have an account?" linkText="Create one" href="/sign-up" />
      </form>
    </>
  );
};

export default SignIn
