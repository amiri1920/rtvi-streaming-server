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

    // Extract function name and tool_call_id
    const { function_name, tool_call_id } = req.body;

    // Check if the function is "hangup_voicemail"
    if (function_name === "hangup_voicemail") {
        // Send streaming response in SSE format
        res.write(`event: action\n`);
        res.write(`data: ${JSON.stringify({
            service: "rtvi",
            action: "hangup",
            arguments: { reason: "voicemail detected" },
            tool_call_id: tool_call_id // Ensure it is mapped correctly
        })}\n\n`);

        // Send event to close connection
        res.write(`event: close\n\n`);

        // End the response after sending data
        res.end();
        console.log(`✅ Sent hangup action for call ${tool_call_id}`);
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
