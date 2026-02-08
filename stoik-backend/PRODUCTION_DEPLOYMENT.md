# 🚀 Stoik Production Deployment Guide

## Week 1 Hardening Implementation Complete

This guide covers the production deployment of Stoik with security and logging hardening implemented.

## ✅ What's Been Implemented

### Security Hardening
- **Helmet**: HTTP security headers
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Joi schemas for all POST/PUT routes
- **Request ID Tracking**: Unique request tracing
- **CORS Configuration**: Proper cross-origin setup

### Logging Infrastructure
- **Winston Logger**: Structured logging with daily rotation
- **Request/Response Logging**: Full HTTP request tracing
- **Error Tracking**: Comprehensive error logging
- **Log Files**: Automatic daily rotation and cleanup

## 🔧 Installation & Setup

### 1. Install Dependencies
```bash
cd stoik-backend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Environment Variables:**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stoik

# JWT Security
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3002
NODE_ENV=production
LOG_LEVEL=info
FRONTEND_URL=https://yourdomain.com
```

## 🧪 Testing Components

### View Logs
```bash
# View application logs
npm run logs:view

# View error logs
npm run logs:errors
```

## 🔒 Security Checklist

### Before Production Deployment

- [ ] **JWT Secret**: Generate strong 32+ character secret
- [ ] **Database**: Use MongoDB Atlas with authentication
- [ ] **HTTPS**: Enable SSL/TLS certificates
- [ ] **Environment Variables**: Never commit `.env` to version control
- [ ] **Rate Limiting**: Configure appropriate limits for your traffic
- [ ] **CORS**: Set specific frontend domain (not wildcard)

### Security Headers Implemented
```javascript
// Helmet configuration includes:
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: same-origin
- X-XSS-Protection: 1; mode=block
```

### Rate Limiting Configuration
```javascript
// Current limits:
- General API: 100 requests/15 minutes
- Auth endpoints: 5 requests/15 minutes
```

## 📊 Monitoring & Observability

### Log Files Location
```
stoik-backend/logs/
├── stoik-2024-01-17.log          # Application logs
├── stoik-error-2024-01-17.log    # Error logs
├── stoik-exceptions-2024-01-17.log # Uncaught exceptions
└── stoik-rejections-2024-01-17.log # Unhandled rejections
```

### Log Retention
- **Application logs**: 14 days
- **Error logs**: 30 days
- **Exception logs**: 30 days
- **Max file size**: 20MB per file

### Request Tracing
Every request gets a unique ID for tracing:
```
2024-01-17 10:30:15 [INFO] [abc-123-def] Request started GET /v1/subscriptions
2024-01-17 10:30:16 [INFO] [abc-123-def] Request completed GET /v1/subscriptions 200 150ms
```

## 🚨 Error Handling

### Structured Error Responses
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ],
  "timestamp": "2024-01-17T10:30:15.123Z",
  "requestId": "abc-123-def"
}
```

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `AUTHENTICATION_FAILED`: Invalid JWT token
- `AUTHORIZATION_FAILED`: Insufficient permissions
- `INTERNAL_ERROR`: Server error

## 📧 Email Templates

Email templates are not configured in this backend version.

## 🔄 Deployment Process

### 1. Pre-deployment Checks
```bash
# Check environment variables
node -e "console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0)"

# Test database connection
node -e "require('./src/db/connection').connectDB().then(() => console.log('DB OK'))"
```

### 2. Production Start
```bash
# Production mode
NODE_ENV=production npm start

# With PM2 (recommended)
pm2 start src/index.js --name stoik-backend --env production
```

### 3. Health Check
```bash
curl http://localhost:3002/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-17T10:30:15.123Z",
  "uptime": 3600,
  "version": "1.0.0",
  "requestId": "abc-123-def"
}
```

## 🎯 Performance Considerations

### Database Indexes
Ensure these indexes exist in MongoDB:
```javascript
// Users
db.users.createIndex({ email: 1 })
db.users.createIndex({ status: 1 })

// Subscriptions
db.subscriptions.createIndex({ userId: 1, status: 1 })
db.subscriptions.createIndex({ nextBillingDate: 1, status: 1 })
```

### Memory Usage
- **Expected RAM**: 512MB - 1GB
- **Log rotation**: Prevents disk space issues
- **Connection pooling**: MongoDB connection reuse

## 🔍 Troubleshooting

### Common Issues

**1. Rate limiting too strict**
```bash
# Check current limits in logs
grep "RATE_LIMIT_EXCEEDED" logs/stoik-$(date +%Y-%m-%d).log
```

**2. Database connection issues**
```bash
# Check MongoDB URI
node -e "console.log('MongoDB URI:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***@'))"
```

**3. JWT token issues**
```bash
# Verify JWT secret length
node -e "console.log('JWT secret length:', process.env.JWT_SECRET?.length)"
```

## 📈 Next Steps (Week 2+)

1. **Monitoring**: Integrate Sentry for error tracking
2. **Caching**: Add Redis for session management
3. **Load Balancing**: Configure nginx reverse proxy
4. **Database**: Set up MongoDB replica set
5. **Backup**: Implement automated database backups
6. **CI/CD**: Set up automated deployment pipeline

## 🆘 Support

For production issues:
1. Check application logs: `npm run logs:view`
2. Check error logs: `npm run logs:errors`
3. Contact: support@stoik.com

---

**Stoik is now production-ready with enterprise-grade security and logging.**
