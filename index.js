const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/webhook/rtvi", (req, res) => {
  console.log("Received payload:", JSON.stringify(req.body, null, 2));

  // Set headers for SSE (Server-Sent Events)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  if (res.flushHeaders) {
    res.flushHeaders();  // Flush headers immediately
  }

  // Extract function name and tool_call_id
  const { function_name, tool_call_id } = req.body;

  if (function_name === "hangup_voicemail") {
    // Send the RTVI hangup action as an SSE event
    res.write(`event: action\n`);
    res.write(`data: ${JSON.stringify({
      service: "rtvi",
      action: "hangup",
      arguments: { reason: "voicemail detected" },
      tool_call_id: tool_call_id
    })}\n\n`);
    // Send a closing event
    res.write(`event: close\n\n`);

    // End the response after a short delay to ensure the client has time to read the events
    setTimeout(() => {
      res.end();
      console.log(`✅ Sent hangup action for call ${tool_call_id}`);
    }, 100); // 100ms delay (adjust if needed)
  } else {
    console.log("❌ Unsupported function:", function_name);
    res.status(400).json({ error: "Unsupported function" });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Streaming server running on port ${PORT}`);
});
