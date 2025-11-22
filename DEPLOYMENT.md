# Deployment Guide - Vercel + GitHub

This guide walks you through setting up automatic deployments to Vercel via GitHub.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Git installed locally

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ScoreKeep` (or your preferred name)
3. Choose Public or Private
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Connect Local Repo to GitHub

After creating the repo, GitHub will show you commands. Run these in your terminal:

```bash
cd /Users/etiennecossart/ScoreKeep
git add .
git commit -m "Initial commit: ScoreKeep MVP setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ScoreKeep.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Setup Vercel Project

1. Go to https://vercel.com and sign in (you can use GitHub to sign in)
2. Click "Add New..." → "Project"
3. Import your `ScoreKeep` repository from GitHub
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client` (important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. Click "Deploy"

## Step 4: Environment Variables (if needed later)

If you need to set environment variables for the frontend:
- Go to your project settings → Environment Variables
- Add variables with prefix `REACT_APP_` (e.g., `REACT_APP_API_URL`)
- Redeploy after adding variables

## Step 5: Verify Deployment

1. After deployment completes, Vercel will give you a URL (e.g., `scorekeep.vercel.app`)
2. Visit the URL to verify your app is live
3. Make a test change, commit, and push to see auto-deploy in action

## Testing the Workflow

1. Make a small change (e.g., update README)
2. Commit: `git commit -am "Test: Verify Vercel auto-deploy"`
3. Push: `git push`
4. Check Vercel dashboard - you should see a new deployment starting automatically

## Troubleshooting

- **Build fails**: Check Vercel build logs for errors
- **404 on routes**: May need to configure redirects in `vercel.json` (for React Router)
- **Environment variables not working**: Ensure they're prefixed with `REACT_APP_` for CRA

## Next Steps

Once Vercel is working, you'll also need to deploy the backend (see README for Render setup).

