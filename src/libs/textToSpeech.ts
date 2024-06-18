import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const textToSpeech = new TextToSpeechClient();

async function convertTextToSpeech(params: { text: string }) {
	if (!params.text) throw new Error("Missing 'text' param");

	let retries = 0;
	const maxRetries = 3;

	while (retries < maxRetries) {
		try {
			const [response] = await textToSpeech.synthesizeSpeech({
				input: { text: params.text },
				voice: {
					languageCode: "en-US",
					ssmlGender: "FEMALE",
					// name: "en-US-Journey-F",
					name: "en-US-Wavenet-F",
				},
				audioConfig: { audioEncoding: "MP3" },
			});
			if (!response.audioContent)
				throw new Error("No audio content in response");
			if (typeof response.audioContent === "string")
				throw new Error("Audio content is not a buffer");

			return response.audioContent;
		} catch (error: any) {
			if (error?.code === 13 && retries < maxRetries - 1) {
				retries++;
				console.log(`Retry attempt ${retries} due to error code 13.`);
			} else {
				throw error;
			}
		}
	}
	throw new Error("Failed to convert text to speech");
}

export { convertTextToSpeech };
