# Deploy to Cloud in 10 Minutes

## Fastest Way: Render.com

### Prerequisites
- GitHub account (free at https://github.com/signup)
- OpenRouter API key (free at https://openrouter.ai/keys)

### 3 Steps

#### Step 1: Push Code to GitHub (5 min)
```bash
# In your project folder, open terminal/command prompt and run:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/naming-intelligence-engine.git
git push -u origin main
```
*(Replace YOUR_USERNAME with your actual GitHub username)*

#### Step 2: Deploy to Render (3 min)
1. Go to https://render.com → Sign up with GitHub
2. Click **New** → **Web Service**
3. Select your GitHub repo
4. Click **Advanced**
5. Add env var: `OPENROUTER_API_KEY` = your API key
6. Click **Create Web Service**
7. Wait 3-5 minutes

#### Step 3: Use It (2 min)
1. Go to the URL Render gives you (looks like `https://naming-engine-xxxxx.onrender.com`)
2. Go to **Knowledge** → **Seed starter knowledge**
3. Done! Share the URL with your team

---

## That's it!

✓ No installation on anyone's computer
✓ Works on any browser, any device
✓ Free tier ($0/month)
✓ Auto-restarts on code updates

Render free tier sleeps after 15 min idle (wakes up in 30 sec), but perfect for team use.
