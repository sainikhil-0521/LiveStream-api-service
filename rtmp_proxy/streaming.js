const { spawn } = require("child_process");
const WebSocket = require("ws");

const PORT = 5001;
const RTMP_URL = "rtmp://localhost/live/stream";
const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Client connected");
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      "pipe:0", // Read from stdin
      "-c:v",
      "libx264", // Convert VP8 (WebM) to H.264
      "-preset",
      "veryfast",
      "-tune",
      "zerolatency",
      "-c:a",
      "aac", // Convert Opus to AAC
      "-b:a",
      "128k",
      "-f",
      "flv", // RTMP output
      "rtmp://172.17.0.3:1935/live/stream",
    ]);
  ffmpeg.stdout.on("data", (data) => {
    console.log(`FFmpeg Output: ${data.toString()}`);
  });
  ffmpeg.stderr.on("data", (data) => {
    console.log(`FFmpeg Error: ${data.toString()}`);
  });

  // Log FFmpeg exit
  ffmpeg.on("exit", (code) => {
    console.log(`FFmpeg exited with code ${code}`);
  });

  // Send WebSocket data to FFmpeg
  ws.on("message", (data) => {
    console.log(`📡 Received chunk: ${data.length} bytes`);
    ffmpeg.stdin.write(data);
  });

  // Handle WebSocket close
  ws.on("close", () => {
    console.log("Client disconnected");
    ffmpeg.stdin.end(); // End FFmpeg input stream
    ffmpeg.kill("SIGINT"); // Terminate FFmpeg process
  });

  // Handle WebSocket errors
  ws.on("error", (err) => {
    console.log(`WebSocket Error: ${err.message}`);
  });
});

console.log(`WebSocket to RTMP server running on ws://localhost:${PORT}`);
