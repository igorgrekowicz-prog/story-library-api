export default async function handler(req, res) {
  const email = "mystoryfriend@outlook.com";

  const SUPABASE_URL = "https://bqkxhjwpkbtsebaunile.supabase.co";
  const SUPABASE_KEY = "sb_secret_TRk5yffu4EoXs_K2nneaQQ_shF0jMwA";

  try {
    const storiesResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/stories?customer_email=eq.${email}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const stories = await storiesResponse.json();

    const results = await Promise.all(
      stories.map(async (story) => {
        const pageResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/story_pages?story_id=eq.${story.story_id}&order=page_number.asc&limit=1`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`
            }
          }
        );

        const pages = await pageResponse.json();

        return {
          story_id: story.story_id,
          story_title: story.story_title,
          cover_image: pages[0]?.image_url || ""
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
}

        return {
          story_id: story.story_id,
          story_title: story.story_title,
          cover_image: pages[0]?.image_url || ""
        };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
}
