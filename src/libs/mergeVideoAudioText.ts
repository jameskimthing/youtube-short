import ffmpeg from "fluent-ffmpeg";

function mergeVideoAudioText(params: {
	audioPath: string;
	videoPath: string;
	outputPath: string;
	text: string;
}) {
	ffmpeg()
		.addInput(params.videoPath)
		.addInput(params.audioPath)
		.outputOptions([
			"-map 0:v",
			"-map 1:a",
			"-c:a aac",
			"-b:a 192k",
			"-ar 44100",
			"-shortest",
		])
		// .output(params.outputPath)
		.output("./output.mp4")
		.on("start", function (commandLine) {
			console.log("Spawned Ffmpeg with command: " + commandLine);
		})
		.on("progress", function (progress) {
			console.log("Processing: " + progress.targetSize + " KB converted");
		})
		.on("error", function (err, stdout, stderr) {
			console.error("Error:", err);
			console.error("FFmpeg stdout:", stdout);
			console.error("FFmpeg stderr:", stderr);
		})
		.on("end", function () {
			console.log("Processing finished!");
		})
		.run();
}

export { mergeVideoAudioText };
