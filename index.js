const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
const sessionId = uuid.v4();

app.post("/send-msg", async (req, res) => {
  const data = await runSample(req.body.MSG);
  console.log(data);
  res.json({ data });
});

app.listen(5001, () => {
  console.log("server started");
});
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg, projectId = "oldagebot-rsdg") {
  // A unique identifier for the given session

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "oldagebot-rsdg-2a4fff0bc371.json",
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: "en-US",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log("  No intent matched.");
  }
  return result.fulfillmentText;
}

// runSample();
