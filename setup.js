#!/usr/bin/env node

/**
 * One-command setup wizard for Naming Intelligence Engine
 * Run: node setup.js
 * Handles Node.js check, .env setup, npm install, and starts dev server
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log("\n🚀 Naming Intelligence Engine — Setup Wizard\n");

  // Step 1: Check Node.js
  console.log("Step 1: Checking Node.js...");
  try {
    const nodeVersion = execSync("node --version", { encoding: "utf8" }).trim();
    console.log(`✓ Node.js ${nodeVersion} installed\n`);
  } catch {
    console.error("✗ Node.js not found. Please install from nodejs.org\n");
    process.exit(1);
  }

  // Step 2: Create .env.local if it doesn't exist
  console.log("Step 2: Setting up environment...");
  const envPath = path.join(__dirname, ".env.local");
  const envExamplePath = path.join(__dirname, ".env.local.example");

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log("✓ Created .env.local\n");
    } else {
      console.log("⚠ .env.local.example not found, creating basic .env.local\n");
      fs.writeFileSync(
        envPath,
        `OPENROUTER_API_KEY=
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
OPENROUTER_FALLBACK_MODELS=meta-llama/llama-3.3-70b-instruct:free,openai/gpt-oss-120b:free
OPENROUTER_MAX_TOKENS=8000
LLM_TIMEOUT_MS=300000
DB_PATH=./data/app.db
`
      );
    }
  } else {
    console.log("✓ .env.local already exists\n");
  }

  // Step 3: Ask for API key
  console.log("Step 3: OpenRouter API Key");
  console.log(
    "Get a FREE key at: https://openrouter.ai/keys (takes 2 minutes)\n"
  );

  const apiKey = await question("Paste your OpenRouter API key (or press Enter to skip): ");

  if (apiKey.trim()) {
    let envContent = fs.readFileSync(envPath, "utf8");
    envContent = envContent.replace(
      /OPENROUTER_API_KEY=.*/,
      `OPENROUTER_API_KEY=${apiKey.trim()}`
    );
    fs.writeFileSync(envPath, envContent);
    console.log("✓ API key saved\n");
  } else {
    console.log("⚠ Skipped. You can edit .env.local manually later.\n");
  }

  // Step 4: Install dependencies
  console.log("Step 4: Installing dependencies (this takes 2-3 minutes)...\n");
  try {
    execSync("npm install", { stdio: "inherit" });
    console.log("\n✓ Dependencies installed\n");
  } catch {
    console.error("✗ npm install failed. Check your internet connection.\n");
    process.exit(1);
  }

  // Step 5: Start dev server
  console.log("Step 5: Starting the app...\n");
  console.log("═".repeat(60));
  console.log(
    "🌐 Open your browser to: http://localhost:3000"
  );
  console.log(
    "📚 Go to /knowledge and click 'Seed starter knowledge' first"
  );
  console.log("═".repeat(60));
  console.log("");

  rl.close();

  // Start dev server
  execSync("npm run dev", { stdio: "inherit" });
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
