import { postToFacebook } from "@/lib/facebook";

export async function POST(request: Request) {
  const { message, link, imageUrl } = await request.json();

  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  const result = await postToFacebook(message, link, imageUrl);

  if (result.success) {
    return Response.json({ success: true, postId: result.postId });
  }

  return Response.json(
    { error: result.error || "Failed to post to Facebook" },
    { status: 500 }
  );
}
