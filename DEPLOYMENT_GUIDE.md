# 🚀 Quick Start & Deployment Guide

**Version:** 2.0.0  
**Status:** Production Ready  
**Last Updated:** November 19, 2025

---

## ⚡ Quick Start (Development)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo MONGO_URI=your_mongodb_uri > .env
echo SECRET_KEY=your-secret-key >> .env

# Start backend server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend runs at:** `http://localhost:8000`  
**API Docs:** `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start frontend dev server
npm start
```

**Frontend runs at:** `http://localhost:3000`

### 3. Access the Application

- **Home Page:** `http://localhost:3000`
- **Student Prediction:** `http://localhost:3000/predict`
- **Admin Dashboard:** `http://localhost:3000/admin`
- **Teacher Portal:** `http://localhost:3000/teacher/login`

---

## 📦 Deployment (Production)

### Prerequisites
- Node.js 16+ installed
- Python 3.8+ installed
- MongoDB Atlas account or self-hosted MongoDB
- Server/Cloud hosting (AWS, Heroku, DigitalOcean, etc.)

### Step 1: Prepare Backend

```bash
cd backend

# Create production .env file
cat > .env << EOF
MONGO_URI=your_production_mongodb_uri
API_HOST=0.0.0.0
API_PORT=8000
SECRET_KEY=your-strong-secret-key-change-this
DEBUG=False
LOG_LEVEL=INFO
EOF

# Install dependencies
pip install -r requirements.txt

# Test the application
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Step 2: Prepare Frontend

```bash
cd frontend

# Build for production
npm run build

# This creates `build/` folder with optimized assets
```

### Step 3: Deploy Backend

#### Option A: Heroku
```bash
# Install Heroku CLI, then:
heroku login
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set SECRET_KEY=your-secret-key
git push heroku main
```

#### Option B: AWS EC2
```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Python and dependencies
sudo yum install python3 python3-pip
pip3 install -r backend/requirements.txt

# Create systemd service
sudo tee /etc/systemd/system/student-predictor.service << EOF
[Unit]
Description=Student Performance Predictor API
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/student2.0/backend
ExecStart=/usr/local/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start service
sudo systemctl start student-predictor
sudo systemctl enable student-predictor
```

#### Option C: Docker
```bash
# Create Dockerfile in backend/
cat > Dockerfile << EOF
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Build and push
docker build -t student-predictor:latest .
docker push your-registry/student-predictor:latest
```

### Step 4: Deploy Frontend

#### Option A: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
npm run build
netlify deploy --prod --dir=build
```

#### Option B: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Option C: AWS S3 + CloudFront
```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name/

# Create CloudFront distribution pointing to S3
# Add custom domain and SSL certificate
```

### Step 5: Configure Production Environment

#### Backend Environment Variables
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/student_predictor
API_HOST=0.0.0.0
API_PORT=8000
SECRET_KEY=your-very-strong-secret-key-min-32-chars
DEBUG=False
LOG_LEVEL=INFO
CORS_ORIGINS=["https://yourdomain.com"]
```

#### Frontend Environment Variables (`.env.production`)
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

### Step 6: Set Up Database

```bash
# MongoDB Atlas (Cloud)
# 1. Create cluster at mongodb.com/atlas
# 2. Create database: student_predictor
# 3. Create collections:
#    - predictions
#    - teachers
#    - batch_predictions
# 4. Create index on teachers.email (unique)
# 5. Get connection string

# Or Self-Hosted MongoDB
# mongod --replSet "rs0"
# rs.initiate()
```

### Step 7: SSL/TLS Configuration

```bash
# Using Let's Encrypt with Nginx
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com

# Configure Nginx
sudo tee /etc/nginx/sites-available/student-predictor << EOF
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location / {
        root /var/www/student-predictor;
        try_files \$uri /index.html;
    }
}
EOF

sudo systemctl restart nginx
```

---

## 🔒 Security Checklist

- [ ] Change SECRET_KEY to strong random value (32+ chars)
- [ ] Set DEBUG=False in production
- [ ] Use HTTPS/SSL for all connections
- [ ] Configure CORS to specific domains only
- [ ] Enable MongoDB authentication
- [ ] Set strong database passwords
- [ ] Enable database backups
- [ ] Configure rate limiting on API
- [ ] Enable request logging
- [ ] Set up monitoring/alerts
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## 📊 Monitoring & Maintenance

### Logging
```bash
# Backend logs (systemd)
sudo journalctl -u student-predictor -f

# Application logs
tail -f backend/logs/predictions_*.log
```

### Database Maintenance
```bash
# MongoDB backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/student_predictor" \
  --out /backup/student_predictor_$(date +%Y%m%d)

# MongoDB restore
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/student_predictor" \
  /backup/student_predictor_20251119
```

### Performance Monitoring
- Set up APM (New Relic, DataDog, etc.)
- Monitor API response times
- Track database query performance
- Monitor disk/memory usage
- Set up alerts for failures

---

## 🧹 Regular Maintenance Tasks

### Weekly
- [ ] Check error logs
- [ ] Monitor database size
- [ ] Review API performance metrics

### Monthly
- [ ] Update dependencies
  ```bash
  npm outdated          # Frontend
  pip list --outdated   # Backend
  ```
- [ ] Database optimization
- [ ] Review and archive old predictions

### Quarterly
- [ ] Security audit
- [ ] Performance tuning
- [ ] Disaster recovery test

---

## 🐛 Troubleshooting

### Backend Issues

**API not starting**
```bash
# Check Python version
python --version  # Should be 3.8+

# Check dependencies
pip install -r requirements.txt --upgrade

# Check MongoDB connection
python -c "from pymongo import MongoClient; MongoClient('$MONGO_URI')"
```

**Prediction errors**
```bash
# Check scikit-learn installation
python -c "import sklearn; print(sklearn.__version__)"

# Retrain model if needed
python -m uvicorn main:app --host 0.0.0.0 --port 8000
# POST /train/retrain
```

### Frontend Issues

**Blank page / Router issues**
```bash
# Clear browser cache and rebuild
npm run build
# Ensure API_URL is correct in .env.production

# Check browser console for errors
# F12 → Console tab
```

**API not connecting**
```bash
# Check CORS settings in backend
# Verify API_URL in frontend .env
# Ensure backend is running and accessible
curl http://api-server:8000/
```

### Database Issues

**Connection refused**
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check credentials in MONGO_URI
# Verify network access in MongoDB Atlas
```

**Slow queries**
```bash
# Create indexes
db.predictions.createIndex({created_at: -1})
db.teachers.createIndex({email: 1})
```

---

## 📈 Scaling Recommendations

### For 1,000+ Students

1. **Database:**
   - Enable MongoDB Atlas auto-scaling
   - Create indexes on frequently queried fields
   - Consider database sharding

2. **Backend:**
   - Deploy multiple instances behind load balancer
   - Use Gunicorn with multiple workers
   - Enable caching (Redis)
   - Consider async task processing (Celery)

3. **Frontend:**
   - Use CDN for static assets
   - Enable gzip compression
   - Optimize images and bundles
   - Consider edge caching

### Example: Gunicorn Production Setup
```bash
# Install Gunicorn
pip install gunicorn

# Start with 4 workers
gunicorn -w 4 -b 0.0.0.0:8000 main:app

# With Nginx reverse proxy
# (see SSL configuration above)
```

---

## 📞 Support & Contact

**Documentation:** See `API_DOCS.md` and `FEATURES_IMPLEMENTED.md`  
**Testing Guide:** See `TESTING_GUIDE.md`  
**Issues:** Check logs and restart services

---

## ✅ Deployment Checklist

- [ ] Environment variables configured
- [ ] Database backup created
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules configured
- [ ] Domain/DNS configured
- [ ] CORS properly set
- [ ] Rate limiting configured
- [ ] Monitoring enabled
- [ ] Logging enabled
- [ ] Backup strategy in place
- [ ] Team trained on operation
- [ ] Documentation reviewed

---

**Ready for Production! 🎉**
