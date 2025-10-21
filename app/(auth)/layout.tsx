import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Authentication Layout Component
 * Handles the layout for sign-in and sign-up pages
 * Redirects authenticated users to home page
 */
const Layout = async ({ children }: { children: React.ReactNode }) => {
  // Check if user is already authenticated
  const session = await auth.api.getSession({ headers: await headers() });

  // Redirect to home if user is already logged in
  if (session?.user) redirect('/');

  return (
    <main className="auth-layout">

      {/* Left section: Logo and auth forms */}
      <section className="auth-left-section scrollbar-hide-default">
        <Link href="/" className="auth-logo">
          <Image src="/assets/icons/logo.svg" alt="Signalis logo" width={140} height={32} className="h-8 w-auto" />
        </Link>
        {/* Render auth form (sign in/sign up) */}
        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>

      {/* Right section: Testimonial and dashboard preview */}
      <section className="auth-right-section">

        {/* Testimonial block */}
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <blockquote className="auth-blockquote">
            Signalist turned my watchlist into a winning list. The alerts are spot-on, and I feel more confident making moves in the market
          </blockquote>

          {/* Testimonial author and rating */}
          <div className="flex items-center justify-center">
            <div>
              <cite className="auth-testimonial-author">- Trong Tr.</cite>
              <p className="max-md:text-xs text-gray-500">Retail Investor</p>
            </div>

            {/* 5-star rating display */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image src="/assets/icons/star.svg" alt="Star" key={star} width={20} height={20} className="w-5 h-5" />
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard preview image */}
        <div className="flex-1 relative">
          <Image src="/assets/images/dashboard.png" alt="Dashboard Preview" width={1440} height={1150} className="auth-dashboard-preview absolute top-0" />
        </div>
      </section>
    </main>
  )
}

export default Layout