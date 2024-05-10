import "dotenv/config";
import express from "express";
import { chromium } from "playwright";
import { CONFIG } from "./config";
import { redditRoutes } from "./reddit";

const app = express();
app.use(express.json());
app.use("/reddit", redditRoutes);

const port = CONFIG.PORT;
app.get("/", async (req, res) => {
	const browser = await chromium.launch();
	const page = await browser.newPage();
	await page.goto("https://example.com");
	const title = await page.title();
	await browser.close();

	res.send(`Page title: ${title}`);
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
