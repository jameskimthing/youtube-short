function convertAmITheAssholeWords(text: string): string {
	// Replace age and gender indicators
	text = text.replace(
		/\b(\d+)[,\s]*(?:([mMfF])|(?:[fF]\b))?/g,
		(match, age, gender) => {
			if (gender) {
				const formattedGender =
					gender.toLowerCase() === "m" ? "male" : "female";
				return `(${age}, ${formattedGender})`;
			} else {
				return `(${age})`;
			}
		}
	);

	// Replace duplicate parentheses
	text = text.replace(/\(\(/g, "(");
	text = text.replace(/\)\)/g, ")");

	// Replace common phrases
	text = text.replace(/\b(AITA|WIBTA|NTA|YTA|ESH|NAH|INFO)\b/g, (match) => {
		switch (match.toUpperCase()) {
			case "AITA":
				return "Am I the asshole";
			case "WIBTA":
				return "Would I ne the asshole";
			case "NTA":
				return "Not the asshole";
			case "YTA":
				return "You're the asshole";
			case "ESH":
				return "Everyone sucks here";
			case "NAH":
				return "No assholes here";
			case "INFO":
				return "More information needed";
			default:
				return match;
		}
	});

	return text;
}

// export { convertAmITheAssholeWords };
