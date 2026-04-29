export default async function handler(req, res) {
  const email = "mystoryfriend@outlook.com";

  const SUPABASE_URL = "https://bqkxhjwpkbtsebaunile.supabase.co";
  const SUPABASE_KEY = "sb_secret_TRk5yffu4EoXs_K2nneaQQ_shF0jMwA";

  try {
    const storiesResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/stories?customer_email=eq.${encodeURIComponent(email)}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const stories = await storiesResponse.json();

    if (!storiesResponse.ok) {
      return res.status(500).json({
        error: "Supabase stories request failed",
        details: stories
      });
    }

    if (!Array.isArray(stories)) {
      return res.status(500).json({
        error: "Stories response was not an array",
        details: stories
      });
    }

    const results = await Promise.all(
      stories.map(async (story) => {
        const pageResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/story_pages?story_id=eq.${encodeURIComponent(story.story_id)}&order=page_number.asc&limit=1`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json"
            }
          }
        );

        const pages = await pageResponse.json();

        return {
          story_id: story.story_id,
          story_title: story.story_title,
          cover_image: Array.isArray(pages) && pages[0] ? pages[0].image_url : ""
        };
      })
    );

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({
      error: "Function crashed",
      message: error.message
    });
  }
}
