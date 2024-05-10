import express from "express";
import { getPostsFromUrl } from "./scraper";

const router = express.Router();

router.post("/scrapeSubreddit", async (req, res) => {
	const body: { url: string } = req.body;
	if (!body.url) return res.status(400).send("Missing 'url' in request body");

	try {
		const postsData = await getPostsFromUrl(body.url);
		return res.json(postsData);
	} catch (err: any) {
		console.error(err.message || err);
		return res.status(500).json({ error: err.message || err });
	}
});

export { router as redditRoutes };
