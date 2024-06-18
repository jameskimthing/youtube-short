function generateTranscript(
	text: string,
	startTime: number = 0,
	duration: number = 0
): string {
	const lines = text.split("\n");
	let transcript = "";
	let currentTime = startTime;
	let subtitleIndex = 1;

	for (const line of lines) {
		const words = line.trim().split(/\s+/);
		const wordsPerLine = 10;
		const chunks = [];

		for (let i = 0; i < words.length; i += wordsPerLine) {
			chunks.push(words.slice(i, i + wordsPerLine).join(" "));
		}

		for (const chunk of chunks) {
			const startTimestamp = formatTimestamp(currentTime);
			const endTime = currentTime + duration / chunks.length;
			const endTimestamp = formatTimestamp(endTime);

			transcript += `${subtitleIndex}\n${startTimestamp} --> ${endTimestamp}\n${chunk}\n\n`;
			currentTime = endTime;
			subtitleIndex++;
		}
	}

	return transcript.trim();
}

function formatTimestamp(seconds: number): string {
	const date = new Date(seconds * 1000);
	const hours = date.getUTCHours().toString().padStart(2, "0");
	const minutes = date.getUTCMinutes().toString().padStart(2, "0");
	const secs = date.getUTCSeconds().toString().padStart(2, "0");
	const ms = date.getUTCMilliseconds().toString().padStart(3, "0");

	return `${hours}:${minutes}:${secs},${ms}`;
}

export { generateTranscript };
