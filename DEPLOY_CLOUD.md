# Deploy to Cloud (Free)

Get the app running on the internet so you can access it from **any browser, anywhere** — no installation needed.

## Option A: Render.com (Easiest, Recommended)

### Step 1: Create GitHub Account
1. Go to **https://github.com/signup**
2. Create a free account (email + password)
3. Remember your username

### Step 2: Upload Code to GitHub
1. Go to **https://github.com/new**
2. Repository name: `naming-intelligence-engine`
3. Description: `Executive program naming AI`
4. Click **Create repository**
5. Follow the instructions to upload files:
   - On your computer, download this project folder
   - In the folder, open terminal/command prompt
   - Run these commands:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/naming-intelligence-engine.git
     git push -u origin main
     ```
   - (Replace `YOUR_USERNAME` with your GitHub username)

### Step 3: Deploy to Render
1. Go to **https://render.com** (click "Sign Up")
2. Sign up with GitHub (easiest)
3. Authorize Render to access your GitHub repos
4. Click **New +** → **Web Service**
5. Select your `naming-intelligence-engine` repo
6. Settings:
   - **Name:** `naming-intelligence-engine`
   - **Runtime:** Node
   - **Build Command:** (leave as-is, auto-detected)
   - **Start Command:** (leave as-is, auto-detected)
7. Click **Advanced** → add environment variable:
   - **Key:** `OPENROUTER_API_KEY`
   - **Value:** Your API key from https://openrouter.ai/keys
8. Click **Create Web Service**
9. Wait 3-5 minutes for deployment
10. Copy the URL (looks like `https://naming-intelligence-engine-xxxxx.onrender.com`)
11. Open that URL in your browser — **it's live!**

### Step 4: First Time
- Go to the URL
- Click **Knowledge** → **Seed starter knowledge**
- You're ready to use it

---

## Option B: Railway.app (Also Easy)

1. Go to **https://railway.app** → Sign up with GitHub
2. New Project → GitHub Repo
3. Select your uploaded `naming-intelligence-engine` repo
4. Add plugin: **PostgreSQL** (easier for cloud than SQLite)
   - *(This requires a small code change — see notes below)*
5. Add environment variables:
   - `OPENROUTER_API_KEY` = your API key
   - `NODE_ENV` = `production`
6. Deploy automatically

---

## Option C: Vercel (For Experts)

Vercel is perfect for Next.js but doesn't support persistent SQLite easily. Use this only if you want to use a hosted PostgreSQL database.

---

## Important Notes

### ✓ Free Tier Limits
- **Render:** 750 hours/month (free tier sleeps after 15 min inactivity)
- **Railway:** $5 free credit/month
- Enough for personal/team use

### ✓ Database
- Data persists on the cloud server
- Survives app restarts
- You won't lose your knowledge base

### ✓ Updates
After you make changes locally:
```bash
git add .
git commit -m "Your changes"
git push origin main
```
Cloud app auto-redeploys in 1-2 minutes.

### ✓ Monitoring
Check deployment logs:
- **Render:** Dashboard → your service → Logs
- **Railway:** Dashboard → your project → Deployments

### ✗ Known Limitations
- App sleeps on Render free tier (wakes up in ~30 seconds)
- Can't upload very large PDFs (100MB+ limit)
- LLM calls have 5-minute timeout (same as local)

---

## Troubleshooting

### "Deployment failed"
- Check GitHub repo has all files
- Check environment variable is set correctly
- See cloud provider's logs for details

### "App is slow"
- It's waking up from sleep (Render free tier)
- Wait 30 seconds, refresh

### "Database error"
- Cloud storage takes a moment to sync
- Refresh the page

### "API key rejected"
- Make sure it's set in environment variables
- Double-check it's not expired at https://openrouter.ai/keys

---

## Next Steps

1. Share the URL with your team
2. Anyone can open it in a browser
3. Everyone uses the same knowledge base
4. Works from laptops, phones, tablets, anywhere

No installation, no admin permissions needed.
