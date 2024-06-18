import express from "express";
import { getPostsFromUrl } from "./scraper";
import { convertTextToSpeech } from "../libs/textToSpeech";
import { SP } from "../libs/supabase";
import * as fs from "fs";
import { promisify } from "util";
import { CONFIG } from "../config";
import { convertRedditWords } from "./convertWords";
import { mergeVideoAudioText } from "../libs/mergeVideoAudioText";
import { generateTranscript } from "../libs/generateTranscripts";

import path from "path";

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

router.post("/convertPostToAudio", async (req, res) => {
	try {
		// Get the post to convert to audio
		const { data: post, error } = await SP.redditposts
			.select("id, title, content, subreddit, post_id")
			.eq("posted", false)
			.limit(1)
			.single();
		if (error) throw error;
		if (!post) return res.status(404).send("No posts to convert to audio");

		console.log("Retrieved entry:", post);

		let text = "";
		if (post.title) {
			post.title = post.title.trim();
			text += post.title.endsWith(".") ? post.title : post.title + ".";
			text += " ";
		}
		if (post.content) {
			post.content = post.content.trim();
			text += post.content.endsWith(".") ? post.content : post.content + ".";
		}

		const newText = text;
		// const newText = await convertRedditWords({
		// 	text: text,
		// 	subreddit: post.subreddit,
		// });

		// Convert the post to audio
		// const audio = await convertTextToSpeech({ text: newText });
		// fs.writeFileSync("./temp/voiceover.mp3", audio);
		// console.log("Audio saved to /temp/voiceover.mp3");

		// // Generate subtitles
		// const duration = 5;
		// const subtitles = generateTranscript(newText, 0, duration);
		// const subtitlePath = "./temp/subtitles.srt";
		// fs.writeFileSync(subtitlePath, subtitles);
		// console.log("Subtitles saved to", subtitlePath);

		// Merge the video, audio, and subtitles

		mergeVideoAudioText({
			audioPath: "./temp/voiceover.mp3",
			videoPath: "./temp/tall.mp4",
			outputPath: `./temp/output-${post.post_id}.mp4`,
			// outputPath: outputPath,
			text: newText,
		});

		// const { error: updateError } = await SP.redditposts
		// 	.update({ posted: true })
		// 	.eq("id", post.id);
		// if (updateError) throw updateError;
	} catch (err: any) {
		console.error(err);
		return res.status(500).json({ error: err.message || err });
	}
});

export { router as redditRoutes };
