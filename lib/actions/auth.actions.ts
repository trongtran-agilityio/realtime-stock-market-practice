'use server';

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";
import { updateCountryForUserEmail } from "@/lib/actions/user.actions";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry }: SignUpFormData) => {

  try {

    // ----------------------------------
    // STEP 1: Sign Up
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName }
    });

    // ----------------------------------
    // STEP 2: Trigger Inngest event
    if (response) {
      // Customize insert country field into this user.
      await updateCountryForUserEmail(email, country);

      await inngest.send({
        name: 'app/user.created',
        data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry },
      });
    }

    // ----------------------------------
    // STEP 3: Done
    return { success: true, data: response };

  } catch (e) {
    console.log('Sign up failed', e);
    return { success: false, error: 'Sign up failed' };
  }
}


export const signInWithEmail = async ({ email, password }: SignInFormData) => {

  try {
    const response = await auth.api.signInEmail({
      body: { email, password }
    });
    return { success: true, data: response };

  } catch (e) {
    console.log('Sign in failed', e);
    return { success: false, error: 'Sign in failed' };
  }
}

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (e) {
    console.log('Sign out failed', e);
    return { success: false, error: 'Sign out failed.' };
  }
}