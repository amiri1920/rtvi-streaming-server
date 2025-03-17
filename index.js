const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook/rtvi', (req, res) => {
  const { function_name, tool_call_id, arguments } = req.body;

  if (function_name === 'hangup_voicemail') {
    // Handle the hangup action here
    console.log(`Received hangup request for call ${tool_call_id}`);
    // Implement your hangup logic
  }

  res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
