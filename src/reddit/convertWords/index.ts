import { promptGemini } from "../../libs/ai";
import { Subreddit } from "../types";

async function convertRedditWords(params: {
	text: string;
	subreddit: Subreddit;
}) {
	const prompt = `You are a highly active and knowledgeable member of the subreddit ${params.subreddit}. You understand all the subreddit-specific slang and terminologies. Your task is to receive a piece of text from a post from this subreddit, filter out any unwanted words or phrases (such as external links, signatures, or irrelevant information), and convert any difficult or subreddit-specific words into easier-to-understand terms. Do not summarize or alter the story; keep everything, including the perspective, intact. Provide the cleaned and converted text and nothing else.

	${params.text}`;

	const convertedText = promptGemini({ prompt });

	return convertedText;
	// switch (subreddit) {
	// 	case "r/AmItheAsshole":
	// 		return convertAmITheAssholeWords(text);
	// 	default:
	// 		return text;
	// }
}

export { convertRedditWords };
