# Deployment Guide

Complete guide to deploy Student Performance Predictor to the cloud.

## Table of Contents
1. [Backend Deployment (Render/Railway)](#backend-deployment)
2. [Frontend Deployment (Vercel)](#frontend-deployment)
3. [Database Setup (MongoDB Atlas)](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment](#post-deployment)

---

## Backend Deployment

### Option 1: Deploy on Render

#### Step 1: Prepare Repository
```bash
# Ensure code is on GitHub
git add .
git commit -m "Deploy Student Performance Predictor"
git push origin main
```

#### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Authorize Render to access your GitHub

#### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. Configure:
   - **Name**: `student-predictor-api`
   - **Region**: Select closest region
   - **Branch**: `main`
   - **Runtime**: `Python 3.10`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0`
   - **Plan**: Free (or paid for production)

#### Step 4: Add Environment Variables
1. Go to "Environment"
2. Add variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student_performance
   DEBUG=False
   ```
3. Click "Deploy"

#### Step 5: Wait for Deployment
- Render will deploy automatically
- You'll get a URL like: `https://student-predictor-api.onrender.com`
- Save this URL for frontend configuration

### Option 2: Deploy on Railway

#### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

#### Step 2: Create New Project
1. Click "New Project"
2. Select "GitHub Repo"
3. Select your repository
4. Click "Deploy Now"

#### Step 3: Configure Variables
1. Go to project settings
2. Add variables:
   ```
   MONGO_URI=mongodb+srv://...
   DEBUG=False
   ```

#### Step 4: Configure Port
1. Set PORT environment variable: `8000`
2. Railway will auto-deploy

---

## Frontend Deployment

### Deploy on Vercel

#### Step 1: Prepare Code
```bash
# Build frontend
cd frontend
npm run build

# Commit changes
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

#### Step 3: Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Select `frontend` directory as root

#### Step 4: Configure Environment Variables
1. Go to "Settings" → "Environment Variables"
2. Add:
   ```
   REACT_APP_API_URL=https://student-predictor-api.onrender.com
   ```
   (Replace with your actual backend URL)

#### Step 5: Deploy
1. Vercel auto-deploys on push
2. You'll get a URL like: `https://student-predictor.vercel.app`
3. Share this with users

---

## Database Setup

### MongoDB Atlas (Recommended)

#### Step 1: Create MongoDB Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create organization and project

#### Step 2: Create Cluster
1. Click "Create a Cluster"
2. Select "Free Tier" (M0)
3. Select cloud provider (AWS recommended)
4. Choose region
5. Click "Create Cluster"

#### Step 3: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Configure:
   - **Username**: `student_user`
   - **Password**: Create strong password (save it!)
   - **Role**: `Atlas Admin`
4. Click "Add User"

#### Step 4: Whitelist IPs
1. Go to "Network Access"
2. Click "Add IP Address"
3. **For testing**: Add your IP
4. **For production**: Either:
   - Add specific deployment provider IPs
   - Click "Allow Access from Anywhere" (0.0.0.0/0)

#### Step 5: Get Connection String
1. Go to "Clusters" → "Connect"
2. Select "Connect your application"
3. Choose "Python" driver
4. Copy connection string
5. Replace `<password>` with your database password
6. Replace `myFirstDatabase` with `student_performance`

#### Example Connection String
```
mongodb+srv://student_user:your_password@cluster0.xxxxx.mongodb.net/student_performance?retryWrites=true&w=majority
```

#### Step 6: Add to Environment
Add to your deployment platform's environment variables:
```
MONGO_URI=mongodb+srv://student_user:your_password@...
```

---

## Environment Variables

### Backend (.env file in Render/Railway)

| Variable | Value | Example |
|----------|-------|---------|
| MONGO_URI | MongoDB connection string | `mongodb+srv://...` |
| API_HOST | API host | `0.0.0.0` |
| API_PORT | API port | `8000` |
| DEBUG | Debug mode | `False` |
| LOG_LEVEL | Log level | `INFO` |

### Frontend (Vercel)

| Variable | Value | Example |
|----------|-------|---------|
| REACT_APP_API_URL | Backend API URL | `https://student-predictor-api.onrender.com` |

---

## Deployment Checklist

### Before Deployment
- [ ] All tests passing locally
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] `.env` has correct configuration
- [ ] Code committed to GitHub
- [ ] Requirements.txt up to date
- [ ] package.json up to date

### Render/Railway Setup
- [ ] Repository connected
- [ ] Build command configured
- [ ] Start command configured
- [ ] Environment variables set
- [ ] MONGO_URI configured
- [ ] DEBUG set to False

### Vercel Setup
- [ ] Repository imported
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variables set
- [ ] REACT_APP_API_URL set correctly

### MongoDB Atlas
- [ ] Cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Connection string obtained
- [ ] URI added to environment

### Post-Deployment
- [ ] Backend URL is accessible
- [ ] Frontend URL is accessible
- [ ] Frontend connects to backend
- [ ] Predictions work end-to-end
- [ ] No CORS errors
- [ ] Data saves to MongoDB

---

## Testing Deployed Application

### Test Backend
```bash
# Health check
curl https://your-backend-url/

# Get model info
curl https://your-backend-url/model-info

# Try prediction
curl -X POST https://your-backend-url/predict \
  -H "Content-Type: application/json" \
  -d '{
    "attendance": 85,
    "assignment_score": 78,
    "internal_marks": 45,
    "prev_cgpa": 8.2,
    "study_hours": 4.5,
    "sleep_hours": 7.0
  }'
```

### Test Frontend
1. Open frontend URL in browser
2. Navigate to all pages (Home, Predict, Dashboard)
3. Fill prediction form and submit
4. Verify results display correctly
5. Check browser console for errors

### Test Database
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Select `student_performance` database
4. Check `predictions` collection
5. Should see your test predictions

---

## Troubleshooting Deployments

### Backend won't start
- Check logs in Render/Railway
- Verify `python train_model.py` was run
- Check MONGO_URI is correct
- Ensure requirements.txt has all packages

### Frontend can't connect to backend
- Check REACT_APP_API_URL is correct
- Check backend is running
- Check CORS is enabled (it should be by default)
- Check browser console for actual error

### MongoDB connection fails
- Verify username and password
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Test locally first

### Vercel build fails
- Check `npm run build` works locally
- Verify all imports are correct
- Check for console errors during build
- Check Node version (16+)

### Render build fails
- Check `pip install -r requirements.txt` works locally
- Verify Python version (3.10+)
- Check for missing dependencies
- Read build logs carefully

---

## Scaling in Production

### Backend Scaling (Render)
1. Upgrade from Free to Starter ($7/month)
2. Enables: Auto-scaling, faster deploys, custom domains
3. Go to "Settings" → "Plan"

### Frontend Scaling (Vercel)
- Free plan includes unlimited deployments
- Pro plan ($20/month) includes: more analytics, support, advanced features

### Database Scaling (MongoDB)
1. Start with Free M0 cluster (512MB)
2. Upgrade to M2 (2GB) if needed
3. Go to "Cluster" → "Modify"

---

## Custom Domains

### Frontend (Vercel)
1. Go to "Settings" → "Domains"
2. Add your domain
3. Add DNS records as shown
4. Verify domain

### Backend (Render)
1. Go to "Settings" → "Custom Domain"
2. Add your domain
3. Add CNAME record: `<app-name>.onrender.com`
4. Verify domain

---

## Continuous Deployment

### GitHub Actions Setup
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

This auto-deploys on every push to main branch.

---

## Monitoring

### Logs
- **Render**: Go to "Logs" tab
- **Railway**: Go to "Logs" tab
- **Vercel**: Go to "Deployments" → "Logs"

### Performance
- **Vercel**: Check "Analytics" for page load times
- **Render**: Monitor in dashboard
- **MongoDB**: Check "Performance" tab

### Alerts
1. Set up email alerts for failures
2. Monitor API response times
3. Track error rates
4. Monitor database usage

---

## Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Render Backend | 0.5 hrs/month | $7/month (Starter) |
| Vercel Frontend | Unlimited | Free or $20/month |
| MongoDB Atlas | 512MB storage | Free or $57+/month |
| **Total** | Basic setup | ~$7-100/month |

---

## Production Best Practices

1. **Set DEBUG=False** in production
2. **Use strong passwords** for database
3. **Enable IP whitelist** in MongoDB
4. **Set up monitoring** and alerts
5. **Regular backups** of database
6. **Update dependencies** regularly
7. **Use HTTPS** (auto with Vercel/Render)
8. **Implement rate limiting**
9. **Add authentication** for admin features
10. **Monitor costs** regularly

---

## Support

- **Render Support**: https://render.com/docs
- **Vercel Support**: https://vercel.com/docs
- **MongoDB Support**: https://docs.mongodb.com
- **GitHub Help**: https://docs.github.com

---

**Deployment Guide Version**: 1.0
**Last Updated**: November 18, 2025
