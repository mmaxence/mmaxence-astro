# GitHub Pages Deployment Guide

## Step 1: Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/mmaxence-astro`
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Source**: `GitHub Actions`
   - (Do NOT select "Deploy from a branch")
4. Save the settings

## Step 2: Update DNS Records

You need to update your DNS records to point to GitHub Pages instead of the old repository.

### Option A: Using Apex Domain (mmaxence.me)

If your domain is configured with A records, update them to:
- **Type**: A
- **Name**: @ (or mmaxence.me)
- **Value**: 
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

### Option B: Using CNAME (www.mmaxence.me)

If you're using a subdomain:
- **Type**: CNAME
- **Name**: www (or your subdomain)
- **Value**: YOUR_USERNAME.github.io

### Option C: Using ALIAS/ANAME (if supported)

Some DNS providers support ALIAS records for apex domains:
- **Type**: ALIAS or ANAME
- **Name**: @
- **Value**: YOUR_USERNAME.github.io

## Step 3: Verify Domain Configuration

1. The `CNAME` file in `public/CNAME` contains your domain (mmaxence.me)
2. After pushing to GitHub, GitHub Pages will automatically detect it
3. GitHub will verify domain ownership (may take a few minutes to hours)

## Step 4: Disable Old Repository's GitHub Pages

1. Go to `https://github.com/YOUR_USERNAME/mmaxence.github.io`
2. Settings → Pages
3. Change source to "None" or disable Pages
4. This prevents conflicts

## Step 5: Push Changes

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

## Step 6: Monitor Deployment

1. Go to **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow run
3. Once complete, your site will be live at `https://mmaxence.me`

## Troubleshooting

- **DNS Propagation**: Can take up to 48 hours, but usually much faster
- **SSL Certificate**: GitHub automatically provisions SSL certificates (may take a few hours)
- **Domain Verification**: Check repository Settings → Pages for domain verification status
- **Build Errors**: Check the Actions tab for build logs

## Important Notes

- The workflow uses `withastro/action@v3` which automatically builds and deploys
- The `CNAME` file tells GitHub Pages which domain to serve
- Make sure your domain DNS is pointing to GitHub Pages IPs before enabling Pages
