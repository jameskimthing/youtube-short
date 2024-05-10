import { Subreddit } from "../types";
import { convertAmITheAssholeWords } from "./AmITheAsshole";

async function convertRedditWords(text: string, subreddit: Subreddit) {
	switch (subreddit) {
		case "r/AmItheAsshole":
			return convertAmITheAssholeWords(text);
		default:
			return text;
	}
}

export { convertRedditWords };
