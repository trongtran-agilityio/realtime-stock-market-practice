import React from 'react'
import Link from "next/link";

/**
 * Footer Link Component
 * Creates a centered text with embedded link
 * Used for form navigation (e.g., "Sign In" -> "Sign Up")
 * 
 * @param text - Main text content
 * @param linkText - Link text
 * @param href - Link destination
 */
const FooterLink = ({ text, linkText, href }: FooterLinkProps) => {
  return (
    <div className="text-center pt-4">
      <p className="text-sm text-gray-500">
        {text}{' '}
        <Link href={href} className="footer-link">
          {linkText}
        </Link>
      </p>
    </div>
  )
}
export default FooterLink
