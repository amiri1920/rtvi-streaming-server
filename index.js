const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook/rtvi', (req, res) => {
  const { function_name, tool_call_id } = req.body;

  if (function_name === 'hangup_voicemail') {
    console.log(`Received hangup request for call ${tool_call_id}`);

    // Return a JSON response that instructs the bot to hang up.
    const responsePayload = {
      action: "hangup",
      arguments: { reason: "voicemail detected" },
      tool_call_id: tool_call_id
    };

    return res.status(200).json(responsePayload);
  }

  res.status(400).json({ error: "Unsupported function" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
