import { Page, chromium, ElementHandle, BrowserContext } from "playwright";
import { CONFIG } from "../../config";
import { SP } from "../../libs/supabase";
import { convertRedditWords } from "../convertWords";
import { Subreddit } from "../types";

async function getPostsFromUrl(url: string) {
	// const browser: Browser = await chromium.connectOverCDP(
	// 	CONFIG.BRIGHT_DATA_URL
	// );
	const browser = await chromium.launch({ headless: false });

	const context = await browser.newContext();
	const page = await context.newPage();

	try {
		const res = await page.goto(url);
		console.log("Response status:", res?.status());

		const elements: ElementHandle[] = await page.$$(".thing");

		const posts = [];
		for (const element of elements) {
			try {
				const { attributes, classes } = await evaluageElement(element);

				// Wanted attributes
				const post_id = attributes["data-fullname"];
				const subreddit = attributes["data-subreddit-prefixed"] as Subreddit;
				const author = attributes["data-author"];
				const url = `https://old.reddit.com${attributes["data-permalink"]}`;
				const score = parseInt(attributes["data-score"]);

				// Skip unwanted posts
				if (attributes["data-is-gallery"] === "true") continue;
				if (attributes["data-promoted"] === "true") continue;
				if (attributes["data-nsfw"] === "true") continue;
				if (classes.includes("stickied")) continue;

				// Get the title, content -> skip if not there
				let { title, content } = await getPostData(context, url);
				if (!title || !content) continue;

				// Convert subreddit-specific phrases
				// title = await convertRedditWords(title, subreddit);
				// content = await convertRedditWords(content, subreddit);

				// Insert post into database, skip if already exists
				const post = { post_id, title, subreddit, author, score, content };
				const { error } = await SP.redditposts.insert(post).select("id");
				if (error) throw error;

				// Add post to list of posts
				posts.push(post);
			} catch (err: any) {
				console.log("Error scraping post:", err.message || err);
			}
		}

		return posts;
	} catch (error) {
		console.error("Error scraping posts:", error);
		return [];
	} finally {
		await page.close();
		await browser.close();
	}
}

async function getPostData(
	context: BrowserContext,
	url: string
): Promise<{ title: string; content: string }> {
	const page: Page = await context.newPage();
	try {
		const res = await page.goto(url);
		console.log("res:", res?.status(), url);

		const sitetable = await page.$("div.sitetable");
		const thing = await sitetable?.$(".thing");

		const title = (await thing?.$eval("a.title", (el) => el.textContent)) ?? "";
		const text =
			(await thing?.$eval("div.usertext-body div.md", (el) => {
				function recursivelyGetText(element: Node) {
					if (element.nodeType === Node.TEXT_NODE) {
						const textContent = element.textContent?.trim();
						return textContent?.endsWith(".") ? textContent : textContent + ".";
					} else {
						let text = "";
						for (const child of element.childNodes) {
							text += recursivelyGetText(child);
						}
						return text;
					}
				}
				return recursivelyGetText(el);
			})) ?? "";

		return { title, content: text };
	} catch (error) {
		console.error("Error scraping post data:", error);
		return { title: "", content: "" };
	} finally {
		await page.close();
	}
}

async function alreadyCrawledBefore(id: string, subreddit: string) {}

async function evaluageElement(handle: ElementHandle): Promise<{
	attributes: { [key: string]: string };
	classes: string[];
}> {
	return handle.evaluate((element: Element) => {
		const attributeMap: { [key: string]: string } = {};
		for (const attr of element.attributes) {
			attributeMap[attr.name] = attr.value;
		}

		const classes = Array.from(element.classList);
		return { attributes: attributeMap, classes };
	});
}

export { getPostsFromUrl, getPostData };
