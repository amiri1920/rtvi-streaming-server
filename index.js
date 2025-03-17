const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/webhook/rtvi', (req, res) => {
  // Set headers for a streaming response
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Log the incoming payload for debugging
  console.log('Received payload:', req.body);

  // Check for the expected function call
  const data = req.body && req.body.body ? req.body.body : req.body;
  if (data.function_name === 'hangup_voicemail') {
    // Prepare the RTVI hangup action chunk
    const rtvichunk = JSON.stringify({
      rtviaction: 'hangup',
      details: { reason: 'voicemail detected' }
    });

    // Write the chunk and add a newline (optional for clarity)
    res.write(rtvichunk + "\n");
  } else {
    // Optionally, send an empty action or an error message
    res.write(JSON.stringify({ message: 'No valid action detected' }) + "\n");
  }

  // End the streaming response
  res.end();
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Streaming server running on port ${PORT}`);
});