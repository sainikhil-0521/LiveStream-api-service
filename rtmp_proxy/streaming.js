const { spawn } = require("child_process");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors"); // Add CORS

// Configuration
const CONFIG = {
  WS_PORT: 5001,
  HTTP_PORT: 5002,
  OUTPUT_DIR: path.join(__dirname, "hls_output"),
  HLS_PLAYLIST: "stream.m3u8",
  SEGMENT_PATTERN: "segment_%03d.ts",
  FFMPEG_OPTIONS: [
    "-i",
    "pipe:0",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-tune",
    "zerolatency",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-f",
    "hls",
    "-hls_time",
    "2",
    "-hls_list_size",
    "0",
    "-hls_flags",
    "delete_segments",
    "-hls_segment_filename",
  ],
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
  fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

// Initialize WebSocket server
const wss = new WebSocket.Server({ port: CONFIG.WS_PORT });

// Initialize Express server
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use("/hls", express.static(CONFIG.OUTPUT_DIR));

// Start Express server
app.listen(CONFIG.HTTP_PORT, () => {
  console.log(
    `HLS files served at http://localhost:${CONFIG.HTTP_PORT}/hls/${CONFIG.HLS_PLAYLIST}`
  );
});

// Utility function to start FFmpeg process for HLS
function startFFmpeg() {
  const hlsSegmentPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.SEGMENT_PATTERN);
  const hlsPlaylistPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.HLS_PLAYLIST);

  const ffmpegArgs = [
    ...CONFIG.FFMPEG_OPTIONS,
    hlsSegmentPath,
    hlsPlaylistPath,
  ];

  const ffmpeg = spawn("ffmpeg", ffmpegArgs, {
    stdio: ["pipe", "pipe", "pipe"],
  });

  ffmpeg.stdout.on("data", (data) => {
    console.log(`FFmpeg Output: ${data.toString().trim()}`);
  });

  ffmpeg.stderr.on("data", (data) => {
    console.error(`FFmpeg Error: ${data.toString().trim()}`);
  });

  ffmpeg.on("exit", (code, signal) => {
    console.log(`FFmpeg exited with code ${code} (Signal: ${signal})`);
  });

  ffmpeg.on("error", (err) => {
    console.error(`FFmpeg Process Error: ${err.message}`);
  });

  return ffmpeg;
}

// WebSocket server event handlers
wss.on("connection", (ws) => {
  console.log("Client connected");

  const ffmpeg = startFFmpeg();

  ws.on("message", (data) => {
    try {
      console.log(`📡 Received chunk: ${data.length} bytes`);
      if (Buffer.isBuffer(data) || data instanceof Uint8Array) {
        ffmpeg.stdin.write(data);
      } else {
        console.warn("Received non-binary data, skipping...");
      }
    } catch (err) {
      console.error(`Error processing message: ${err.message}`);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    cleanupFFmpeg(ffmpeg);
  });

  ws.on("error", (err) => {
    console.error(`WebSocket Error: ${err.message}`);
    cleanupFFmpeg(ffmpeg);
  });
});

// Cleanup function for FFmpeg process
function cleanupFFmpeg(ffmpeg) {
  try {
    if (!ffmpeg.killed) {
      ffmpeg.stdin.end();
      ffmpeg.kill("SIGINT");
      console.log("FFmpeg process terminated");
    }
  } catch (err) {
    console.error(`Error during cleanup: ${err.message}`);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
});

wss.on("error", (err) => {
  console.error(`WebSocket Server Error: ${err.message}`);
});

console.log(
  `WebSocket to HLS server running on ws://localhost:${CONFIG.WS_PORT}`
);
console.log(`HLS files will be saved to: ${CONFIG.OUTPUT_DIR}`);
