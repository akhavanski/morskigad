# 🚀 Deployment Guide

## GitHub Pages Deployment

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `snake` (or any name you prefer)
3. Make it public (required for free GitHub Pages)

### Step 2: Upload Files
Upload all files from this directory to your GitHub repository:
- `index.html`
- `snake.js` 
- `README.md`
- `.gitignore`
- `.github/workflows/pages.yml`
- `DEPLOY.md` (this file)

### Step 3: Enable GitHub Pages
1. Go to your repository **Settings**
2. Scroll down to **Pages** section
3. Under **Source**, select **"GitHub Actions"**
4. Save the settings

### Step 4: Deploy
1. Make sure all files are committed to the `main` branch
2. The GitHub Action will automatically run and deploy your site
3. Your game will be available at: `https://yourusername.github.io/repositoryname`

### Step 5: Play!
🎮 Your Snake game is now live and accessible to anyone with the URL!

---

## Alternative Hosting Options

### Netlify
1. Drag and drop your folder to [Netlify](https://netlify.com)
2. Get instant deployment with custom domain options

### Vercel
1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Automatic deployments on every push

### Local Testing
Simply open `index.html` in any modern web browser - no server required!

---

## Troubleshooting

**Game not loading?**
- Check browser console for JavaScript errors
- Ensure all files are uploaded correctly
- Verify the repository is public (for GitHub Pages)

**GitHub Actions failing?**
- Check the Actions tab in your repository
- Ensure the workflow file is in `.github/workflows/pages.yml`
- Make sure GitHub Pages is enabled in settings

**Need help?**
Open an issue in your repository or check the original requirements!
