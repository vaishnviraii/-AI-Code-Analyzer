// index.js (backend)
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Simple AI-likelihood logic ---
app.post("/analyze", (req, res) => {
    if (!code) return 0;

  let score = 0;
  if (code.includes("async") || code.includes("await")) score += 20;
  if (code.includes("function")) score += 15;
  if (code.length > 100) score += 30;
  if (code.includes("//")) score += 10;
  if (code.match(/\bvar\b/)) score -= 10;

  return Math.min(100, Math.max(0, score));
   // your AI code analyzer logic
});

function analyzeCode(code) {
  if (!code) return 0;

  let score = 0;
  if (code.includes("async") || code.includes("await")) score += 20;
  if (code.includes("function")) score += 15;
  if (code.length > 100) score += 30;
  if (code.includes("//")) score += 10;
  if (code.match(/\bvar\b/)) score -= 10;

  return Math.min(100, Math.max(0, score));
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

