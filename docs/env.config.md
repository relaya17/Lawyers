# Environment Variables Configuration Guide

## ⚠️ הפרדת משתני סביבה — Client vs Server

| משתנה | היכן | למה |
|---|---|---|
| `VITE_*` | Browser (גלוי לכל) | URL, feature flags בלבד |
| ללא prefix | Server בלבד (`apps/server/.env`) | API keys, secrets |

**`VITE_AI_API_KEY` ו-`VITE_AI_API_URL` הוסרו מהקליינט.** הקליינט קורא ל-`/api/ai/*` בשרת, והשרת קורא ל-AI API עם `AI_API_KEY` שנשמר ב-`apps/server/.env`.

---

## משתני סביבה עבור ContractLab Pro

### Client — `apps/web/.env.local`

צור קובץ `.env.local` ב-`apps/web/` עם המשתנים הבאים:

```bash
# API Configuration - הגדרות API
VITE_API_URL=http://localhost:4000
VITE_API_BASE_URL=http://localhost:4000
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

### Server — `apps/server/.env`

```bash
# Server config
PORT=4000
CORS_ORIGIN=http://localhost:5173

# AI credentials — server-side only, never exposed to the browser
AI_API_URL=https://api.contractlab.ai
AI_API_KEY=your_ai_api_key_here
```

> ראה גם: `apps/server/.env.example`


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
