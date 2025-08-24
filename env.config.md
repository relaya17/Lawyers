# Environment Variables Configuration Guide

## משתני סביבה עבור ContractLab Pro

צור קובץ `.env` בשורש הפרויקט עם המשתנים הבאים:

```bash
# API Configuration - הגדרות API
VITE_API_URL=https://api.contractlab.ai
VITE_API_BASE_URL=https://api.contractlab.ai
VITE_WS_URL=wss://api.contractlab.ai/ws

# Development Mode - מצב פיתוח
VITE_DEV_MODE=false

# Analytics & Monitoring - אנליטיקס וניטור
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_WEBSOCKET=true

# Push Notifications (for PWA) - התראות דחיפה
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key_here

# Optional: Sentry for Error Tracking - מעקב שגיאות
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Optional: Google Analytics - גוגל אנליטיקס
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Optional: Feature Flags - דגלי תכונות
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_VIRTUAL_COURT=true
VITE_ENABLE_MARKETPLACE=true

# Build Configuration - הגדרות build
NODE_ENV=production
```

## Environment-Specific Values - ערכים לפי סביבה

### Development (פיתוח):

```bash
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:5174
VITE_DEV_MODE=true
NODE_ENV=development
```

### Production (פרודקשן):

```bash
VITE_API_URL=https://api.contractlab.ai
VITE_WS_URL=wss://api.contractlab.ai/ws
VITE_DEV_MODE=false
NODE_ENV=production
```

### Staging (בדיקות):

```bash
VITE_API_URL=https://staging-api.contractlab.ai
VITE_WS_URL=wss://staging-api.contractlab.ai/ws
VITE_DEV_MODE=false
NODE_ENV=staging
```

## Netlify Environment Variables - משתני נטליפי

בממשק הניהול של נטליפי, הוסף את המשתנים הבאים:

1. `VITE_API_URL` = https://api.contractlab.ai
2. `VITE_WS_URL` = wss://api.contractlab.ai/ws
3. `VITE_ENABLE_ANALYTICS` = true
4. `NODE_ENV` = production

## Security Notes - הערות אבטחה

⚠️ **חשוב**:

- משתני `VITE_*` נחשפים לקליינט - אל תשים בהם מידע סודי
- משתני API keys צריכים להיות במשתנים שלא מתחילים ב-VITE\_
- השתמש ב-`import.meta.env` ולא ב-`process.env`

## Example for Local Development - דוגמה לפיתוח מקומי

צור קובץ `.env.local`:

```bash
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:5174
VITE_DEV_MODE=true
VITE_ENABLE_ANALYTICS=false
```
