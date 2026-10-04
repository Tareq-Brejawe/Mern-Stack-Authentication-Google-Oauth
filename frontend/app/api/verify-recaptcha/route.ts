
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.NEXT_PUBLIC_RECAPATCHA_SECRET_KEY!,
      response: token,
    }),
  });

  const data = await res.json();

  if (!data.success) {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}