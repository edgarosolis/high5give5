import { createToken, COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createToken();
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return Response.json({ success: true });
}
