export default async function handler(req, res) {
  const { story_id } = req.query;

  if (!story_id) {
    return res.status(400).json({ error: "Missing story_id" });
  }

  const SUPABASE_URL = "https://bqkxhjwpkbtsebaunile.supabase.co";
  const SUPABASE_KEY = "sb_secret_TRk5yffu4EoXs_K2nneaQQ_shF0jMwA";

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/story_pages?story_id=eq.${encodeURIComponent(story_id)}&order=page_number.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const pages = await response.json();

    res.status(200).json(pages);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch story" });
  }
}
