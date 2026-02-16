# Deployment Guide for chrisnappi.com

## 🚀 Quick Deployment to Netlify (Recommended)

### Step 1: Sign Up for Netlify (Free)
1. Go to [netlify.com](https://www.netlify.com/)
2. Click "Sign up" → Sign up with GitHub, GitLab, or Email
3. Verify your email if needed

### Step 2: Deploy Your Site

#### Option A: Drag & Drop (Fastest - 2 minutes)
1. Log into Netlify Dashboard
2. Look for the large drop zone that says "Want to deploy a new site without connecting to Git? Drag and drop your site folder here"
3. **Drag your entire `portfolio` folder** onto that area
   - OR zip your portfolio folder first and drag the zip file
4. Netlify will automatically deploy! You'll get a URL like `random-name-123.netlify.app`

#### Option B: GitHub Deploy (Better for Updates)
1. Push your portfolio to GitHub:
   ```bash
   cd /Users/chrisnappi/Desktop/Personal/portfolio
   git init
   git add .
   git commit -m "Initial portfolio commit"
   gh repo create portfolio --public --source=. --push
   ```
2. In Netlify Dashboard: Click "Add new site" → "Import an existing project"
3. Choose GitHub → Select your `portfolio` repository
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: (leave as root `/`)
5. Click "Deploy site"

### Step 3: Connect Your Custom Domain (chrisnappi.com)

1. In Netlify Dashboard → Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter: `chrisnappi.com`
4. Netlify will give you DNS records to configure

**You'll need these DNS records:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME  
Name: www
Value: [your-site-name].netlify.app
```

### Step 4: Update DNS in Google Domains

1. Log into [domains.google.com](https://domains.google.com/)
2. Find `chrisnappi.com` → Click "DNS"
3. Under "Custom records":
   - **Delete old A records** pointing to Squarespace (198.185.159.x)
   - Add new A record:
     - Host name: `@`
     - Type: `A`
     - TTL: `3600`
     - Data: `75.2.60.5` (Netlify's IP)
   - Add CNAME record:
     - Host name: `www`
     - Type: `CNAME`
     - TTL: `3600`
     - Data: `[your-site-name].netlify.app`

4. Save changes

### Step 5: Enable HTTPS (Automatic)
- Netlify automatically provisions a free SSL certificate
- Wait 24-48 hours for DNS propagation
- Your site will be live at https://chrisnappi.com

---

## 🔄 Alternative: Deploy to Vercel

If you prefer Vercel over Netlify:

1. Sign up at [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import from GitHub or drag/drop your portfolio folder
4. Connect custom domain `chrisnappi.com`
5. Update DNS records (Vercel will provide their specific IPs)

---

## 📋 Pre-Deployment Checklist

- ✅ All images optimized
- ✅ SEO meta tags added
- ✅ Test locally before deployment
- ✅ Remove any sensitive data
- ✅ Update any placeholder content

---

## 🆘 Troubleshooting

**DNS not updating?**
- DNS changes can take 24-48 hours to propagate
- Clear your browser cache
- Test with [whatsmydns.net](https://www.whatsmydns.net/)

**Site not loading?**
- Check Netlify/Vercel deployment logs
- Verify all file paths are relative (not absolute)
- Check browser console for errors

**Need help?**
- Netlify Support: [netlify.com/support](https://www.netlify.com/support/)
- Vercel Support: [vercel.com/support](https://vercel.com/support)

---

## 💰 Cost Breakdown

- **Domain Registration**: $20/year (keep with Squarespace)
- **Netlify/Vercel Hosting**: $0/month (free tier)
- **SSL Certificate**: $0 (included)
- **Total**: $20/year

You're saving money by not using Squarespace hosting! 🎉
