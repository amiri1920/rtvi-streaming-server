# RTVI Streaming Server

A Node.js Express server that sends streaming RTVI actions (like a "hangup" command) using HTTP chunked transfer encoding.

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```

The server will run on port 3000 by default, or you can set a custom port using the `PORT` environment variable.

## API Endpoints

### POST /webhook/rtvi

Accepts a JSON payload and responds with streaming RTVI actions.

#### Example Request:

```bash
curl -X POST http://localhost:3000/webhook/rtvi \
  -H "Content-Type: application/json" \
  -d '{
        "body": {
          "function_name": "hangup_voicemail",
          "tool_call_id": "test_call_id",
          "arguments": {}
        }
      }'
```

#### Example Response:

```json
{"rtviaction":"hangup","details":{"reason":"voicemail detected"}}
```

## Deployment

This server is designed to be deployed to Render.com:

1. Push this repository to GitHub
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Render will automatically use the start script in package.json