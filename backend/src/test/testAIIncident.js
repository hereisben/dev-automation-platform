import dotenv from "dotenv";
import generateAIIncidentSummary from "../utils/generateAIIncidentSummary.js";

dotenv.config();

const result = await generateAIIncidentSummary({
  url: "https://api.example.com/users",
  statusCode: 500,
  responseTime: 420,
  bodyPreview: '{"error":"internal server error"}',
  incident: {
    type: "server_error",
    severity: "high",
    message: "The monitored API returned a server error.",
  },
});

console.log(result);
