const { spawn } = require("child_process");
const WebSocket = require("ws");

const PORT = 5001;
const RTMP_URL = "rtmp://localhost/live/stream";
const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Spawn FFmpeg process
  const ffmpeg = spawn("ffmpeg", [
    "-i",
    "-", // Input from stdin
    "-c:v",
    "libx264", // Video codec
    "-preset",
    "ultrafast", // Encoding speed
    "-tune",
    "zerolatency", // Low latency
    "-c:a",
    "aac", // Audio codec
    "-f",
    "flv", // Output format
    RTMP_URL, // RTMP server URL
  ]);

  // Log FFmpeg errors
  ffmpeg.stderr.on("data", (data) => {
    console.error(`FFmpeg Error: ${data.toString()}`);
  });

  // Log FFmpeg exit
  ffmpeg.on("exit", (code) => {
    console.log(`FFmpeg exited with code ${code}`);
  });

  // Send WebSocket data to FFmpeg
  ws.on("message", (data) => {
    if (ffmpeg.stdin.writable) {
      ffmpeg.stdin.write(data);
    }
  });

  // Handle WebSocket close
  ws.on("close", () => {
    console.log("Client disconnected");
    ffmpeg.stdin.end(); // End FFmpeg input stream
    ffmpeg.kill("SIGINT"); // Terminate FFmpeg process
  });

  // Handle WebSocket errors
  ws.on("error", (err) => {
    console.error(`WebSocket Error: ${err.message}`);
  });
});

console.log(`WebSocket to RTMP server running on ws://localhost:${PORT}`);
