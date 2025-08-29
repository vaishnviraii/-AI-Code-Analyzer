// index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Simple AI-likelihood logic ---
function analyzeCode(code) {
  let score = 0;
  if (code.includes("class") || code.includes("def") || code.includes("#include")) score += 30;
  if (code.length > 200) score += 30;
  if (code.match(/\n/gi)?.length > 10) score += 20;
  if (code.includes("/*") || code.includes("//") || code.includes("#")) score += 10;

  // clamp score between 5% and 95%
  score = Math.min(95, Math.max(5, score));
  return score;
}

// --- Streaming route ---
app.get("/analyze-stream", (req, res) => {
  const code = req.query.code || "";
  const aiPercentage = analyzeCode(code);

  const analysisSteps = [
    "Analyzing syntax and structure...",
    "Checking formatting and indentation...",
    "Looking for AI-like patterns...",
    "Finalizing prediction..."
  ];

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  let i = 0;
  const interval = setInterval(() => {
    if (i < analysisSteps.length) {
      res.write(`data: ${analysisSteps[i]}\n\n`);
      i++;
    } else {
      res.write(`data: AI-likelihood: ${aiPercentage}%\n\n`);
      res.write("event: end\ndata: Done\n\n");
      clearInterval(interval);
      res.end();
    }
  }, 1500);
});

// --- Test route ---
app.get("/", (req, res) => {
  res.send("✅ Code Analyzer Backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
