export async function GET() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/R3ACTR/EchoRoom-Community-Ideas-Experiments-Reflection-Platform/contributors",
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 3600 }, // cache for 1 hour
      }
    );

    if (!response.ok) {
      return new Response("Failed to fetch contributors", { status: 500 });
    }

    const data = await response.json();

    // Optional: only send required fields
    const formatted = data.map((contributor: any) => ({
      id: contributor.id,
      login: contributor.login,
      avatar_url: contributor.avatar_url,
      html_url: contributor.html_url,
    }));

    return Response.json(formatted);
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}