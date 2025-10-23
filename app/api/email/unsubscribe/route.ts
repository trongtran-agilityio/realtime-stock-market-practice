import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { setDailyEmailsSubscription } from '@/lib/actions/user.actions';

const SECRET = process.env.EMAIL_UNSUB_SECRET!;

function sign(email: string, t: string) {
  return crypto
    .createHmac('sha256', SECRET)
    .update(`${email}|${t}`)
    .digest('hex');
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const sig = searchParams.get('sig');
    const t = searchParams.get('t');

    if (!email || !sig || !t) {
      return NextResponse.json({ success: false, message: 'Invalid unsubscribe link.' }, { status: 400 });
    }

    const expected = sign(email, t);
    if (expected !== sig) {
      return NextResponse.json({ success: false, message: 'Signature mismatch.' }, { status: 400 });
    }

    // Optional TTL check (30 days)
    // const ageMs = Date.now() - Number(t);
    // if (isFinite(ageMs) && ageMs > 1000 * 60 * 60 * 24 * 30) {
    //   return NextResponse.json({ success: false, message: 'Link expired.' }, { status: 400 });
    // }

    const result = await setDailyEmailsSubscription(email, false);
    if (!result.success) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const html = `<!DOCTYPE html><html><body style="font-family:Arial; background:#0b0b0b; color:#e5e7eb; padding:32px;">
      <div style="max-width:640px; margin:0 auto; background:#141414; border:1px solid #30333A; border-radius:12px; padding:28px;">
        <h2 style="margin-top:0; color:#FDD458;">You've been unsubscribed</h2>
        <p><strong>${email}</strong> will no longer receive daily market news emails from Signalist.</p>
        <p>If this was a mistake, you can resubscribe from your profile inside the app.</p>
        <p style="margin-top:24px;"><a href="${process.env.NEXT_PUBLIC_BASE_URL || '/'}" style="color:#FDD458;">Return to Signalist</a></p>
      </div>
    </body></html>`;
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });

  } catch (e) {
    console.error('Unsubscribe error:', e);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
