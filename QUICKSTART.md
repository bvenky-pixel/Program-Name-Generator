# Quick Start — 3 Minutes to Running

## Step 1: Install Node.js (One-Time)
- Go to **https://nodejs.org**
- Download the LTS version
- Install it (just click Next → Finish)
- Close and reopen your terminal

## Step 2: Run Setup Script

### **Windows:**
1. Download this entire folder
2. Open the folder
3. **Double-click `setup.bat`**
4. Follow the prompts

### **Mac/Linux:**
1. Download this entire folder
2. Open Terminal
3. Run: `bash setup.sh`
4. Follow the prompts

## Step 3: Get Your Free API Key

During setup, you'll need an OpenRouter API key:

1. Go to **https://openrouter.ai/keys**
2. Create a free account (email + password)
3. Click "Create Key"
4. Copy the key
5. Paste it when the setup script asks

That's it! The setup script will:
- ✓ Create your `.env.local` file
- ✓ Save your API key
- ✓ Install all dependencies
- ✓ Start the app
- ✓ Open http://localhost:3000 in your browser

## After Setup: First Steps

1. Go to **Knowledge** page
2. Click **"Seed starter knowledge"** (loads default rules)
3. Go to **Naming Studio** (home page)
4. Fill in your program details
5. Click **"Start Naming Request"**
6. Wait 2-5 minutes for the AI to analyze and recommend names

## Need Help?

### "Node.js not found" error
→ Reinstall Node.js from https://nodejs.org, then close/reopen terminal

### "API key failed" error
→ Make sure your OpenRouter account is activated and the key is correct

### App won't start
→ Try deleting `data/app.db` and running setup again

### Still stuck?
→ Check the full README.md for advanced options
