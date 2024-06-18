import { GoogleGenerativeAI } from "@google/generative-ai";
import { CONFIG } from "../config";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(CONFIG.GOOGLE_AI_STUDIO_API_KEY);

async function promptGemini(params: {
	prompt: string;
	model?: "pro" | "flash";
}) {
	if (!params.model) params.model = "pro";

	const modelName =
		params.model === "pro"
			? "gemini-1.5-pro-latest"
			: "gemini-1.5-flash-latest";

	// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
	const model = genAI.getGenerativeModel({ model: modelName });

	const result = await model.generateContent(params.prompt);
	const response = await result.response;
	const text = response.text();
	return text;
}

export { promptGemini };
