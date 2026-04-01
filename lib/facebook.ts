const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;

interface FacebookPostResult {
  success: boolean;
  postId?: string;
  error?: string;
}

export async function postToFacebook(
  message: string,
  link?: string,
  imageUrl?: string
): Promise<FacebookPostResult> {
  if (!PAGE_ACCESS_TOKEN || !PAGE_ID) {
    return {
      success: false,
      error: "Facebook credentials not configured. Set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID.",
    };
  }

  try {
    // If there's an image, post as a photo with caption
    if (imageUrl) {
      const res = await fetch(
        `https://graph.facebook.com/v21.0/${PAGE_ID}/photos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: imageUrl,
            message: link ? `${message}\n\n${link}` : message,
            access_token: PAGE_ACCESS_TOKEN,
          }),
        }
      );

      const data = await res.json();
      if (data.error) {
        return { success: false, error: data.error.message };
      }
      return { success: true, postId: data.id };
    }

    // Otherwise post as a regular feed post
    const body: Record<string, string> = {
      message,
      access_token: PAGE_ACCESS_TOKEN,
    };
    if (link) body.link = link;

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PAGE_ID}/feed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    if (data.error) {
      return { success: false, error: data.error.message };
    }
    return { success: true, postId: data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Facebook API request failed",
    };
  }
}
