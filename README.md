# LexStudy — מערכת לימוד משפטי חכמה

> פלטפורמה מלאה ללימוד, תרגול ומעקב אישי בדיני ישראל — Web App + Mobile App + REST API

---

## תוכן עניינים

1. [סקירה כללית](#סקירה-כללית)
2. [דרישות מקדימות](#דרישות-מקדימות)
3. [עץ תיקיות](#עץ-תיקיות)
4. [התקנה ועלייה לאוויר (Dev)](#התקנה-ועלייה-לאוויר-dev)
5. [משתני סביבה](#משתני-סביבה)
6. [ארכיטקטורה טכנית](#ארכיטקטורה-טכנית)
7. [תכונות עיקריות](#תכונות-עיקריות)
8. [מבנה ה-Web App](#מבנה-ה-web-app)
9. [מבנה השרת](#מבנה-השרת)
10. [מבנה האפליקציה הניידת](#מבנה-האפליקציה-הניידת)
11. [Auth & Security](#auth--security)
12. [עלייה לייצור (Production)](#עלייה-לייצור-production)
13. [App Store Deployment](#app-store-deployment)
14. [בדיקות](#בדיקות)
15. [כללי קוד ואיכות](#כללי-קוד-ואיכות)

---

## סקירה כללית

**LexStudy** (שם חבילה: `contractlab-pro`) הוא מונורפו המכיל:

| אפליקציה | טכנולוגיה | תיאור |
|---|---|---|
| `apps/web` | React 18 + Vite + MUI 5 | אפליקציית Web מלאה |
| `apps/server` | Node.js + Express + TypeScript | REST API + AI Proxy |
| `apps/mobile` | React Native + Expo 52 | אפליקציה ניידת (iOS/Android) |
| `packages/shared` | TypeScript | ספריית Redux/Types משותפת |

---

## דרישות מקדימות

| כלי | גרסה מינימלית | הערות |
|---|---|---|
| Node.js | `≥ 20.0.0` | מוגדר ב-`.nvmrc` (20.18.0) |
| pnpm | `≥ 9.0.0` | `npm install -g pnpm@9` |
| MongoDB | `≥ 7.x` | לשמירת Virtual Court Snapshots |
| PostgreSQL | `≥ 15` | לניהול משתמשים + Auth |

---

## עץ תיקיות

```
Lawyers-main/                          ← Root monorepo
├── .eslintrc.cjs                      ← ESLint config (strict, no-any)
├── .prettierrc                        ← Prettier config (singleQuote, RTL)
├── .nvmrc                             ← Node version: 20
├── .node-version                      ← Node version: 20.18.0
├── .gitignore                         ← מסנן .env, dist, node_modules
├── package.json                       ← Root (pnpm workspaces + turbo)
├── tsconfig.json                      ← Base TypeScript (strict: true)
│
├── apps/
│   ├── web/                           ← אפליקציית React Web
│   │   ├── .env.example               ← תבנית משתני סביבה (חובה לקרוא!)
│   │   ├── .env.local                 ← משתנים מקומיים (לא מועלה לגיט)
│   │   ├── index.html
│   │   ├── vite.config.ts             ← Vite (port 5852, chunks, RTL)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── main.tsx               ← Entry point + Service Worker
│   │       ├── app/
│   │       │   ├── config/
│   │       │   │   └── apiConfig.ts   ← הגדרות API (base URL, timeout, retry)
│   │       │   ├── i18n/              ← תרגומים: עברית, אנגלית, ערבית
│   │       │   │   ├── he/common.json
│   │       │   │   ├── en/common.json
│   │       │   │   └── ar/common.json
│   │       │   ├── providers/
│   │       │   │   ├── AppProviders.tsx   ← קומפוזיציית כל ה-Providers
│   │       │   │   ├── AuthProvider.tsx   ← Re-export SessionAuthProvider
│   │       │   │   └── ThemeProvider.tsx  ← RTL + Light/Dark
│   │       │   └── theme/
│   │       │       ├── colors.ts
│   │       │       ├── theme.ts       ← createRtlCache + makeTheme
│   │       │       └── index.ts
│   │       ├── components/
│   │       │   └── ui/                ← רכיבי UI גנריים (Button, Input, Table…)
│   │       ├── design/
│   │       │   └── PageHero.tsx       ← כותרת דף אחידה
│   │       ├── entities/              ← טיפוסי Domain (User, Contract, Case)
│   │       ├── features/              ← פיצ'רים לפי תחום
│   │       │   ├── ai-assistant/      ← AI Chat + Suggestions
│   │       │   ├── apple-watch/       ← Apple Watch integration
│   │       │   ├── auth/              ← Login, Register, OTP, Session
│   │       │   │   ├── api/authHttp.ts        ← Fetch + CSRF
│   │       │   │   └── providers/SessionAuthProvider.tsx
│   │       │   ├── contract-management/  ← עריכה, תבניות, ניתוח סיכונים
│   │       │   ├── crm/               ← לקוחות, לידים, מעקב פעילות
│   │       │   ├── external-integrations/ ← אינטגרציות חיצוניות
│   │       │   ├── ios-native/        ← פיצ'רים iOS ייעודיים
│   │       │   ├── learning/          ← קורסים ושיעורים
│   │       │   ├── legal-knowledge/   ← בחינות, משחקים, מושגים משפטיים
│   │       │   │   └── components/
│   │       │   │       ├── Testing/   ← 30+ קבצי בחינה לפי תחום
│   │       │   │       ├── GameModes/ ← משחקי חוק (LawVsCustom, AppellateLadder)
│   │       │   │       ├── CaseStudies/
│   │       │   │       ├── Flashcards/
│   │       │   │       └── …
│   │       │   ├── marketplace/       ← שוק תבניות חוזים
│   │       │   ├── personal-learning/ ← AI מאמן אישי + מעקב התקדמות
│   │       │   │   ├── store/useUserProgressStore.ts  ← Zustand + localStorage
│   │       │   │   ├── services/aiProgressService.ts  ← ניתוח חולשות בעברית
│   │       │   │   ├── hooks/useTrackAnswer.ts        ← Hook לרישום תשובות
│   │       │   │   └── components/PersonalLearningDashboard.tsx
│   │       │   ├── virtual-court/     ← בית משפט וירטואלי (גרסה 1)
│   │       │   └── virtual-court-2/   ← בית משפט וירטואלי מתקדם + Zustand
│   │       ├── hooks/                 ← Custom hooks (useTouchGestures…)
│   │       ├── i18n/                  ← i18n instance ראשי + I18nProvider
│   │       ├── pages/                 ← דפי ניווט (42 דפים)
│   │       │   ├── Auth/
│   │       │   │   ├── Login/         ← דף כניסה
│   │       │   │   └── Register/      ← דף הרשמה
│   │       │   ├── Dashboard/
│   │       │   ├── LegalKnowledge/    ← המרכז הראשי ל-1200+ שאלות
│   │       │   ├── VirtualCourt2/
│   │       │   └── … (עוד 38 דפים)
│   │       ├── routes/
│   │       │   ├── AppRouter.tsx      ← כל הנתיבים (lazy loading)
│   │       │   └── PrivateRoute.tsx   ← הגנה על נתיבים (isAuthenticated)
│   │       ├── services/              ← API clients (RTK Query, axios, fetch)
│   │       ├── store/
│   │       │   └── index.ts           ← Redux store (auth, ui, theme, advanced)
│   │       ├── utils/                 ← lazyLoad, errorBoundary, helpers
│   │       └── widgets/               ← וידג'טים מורכבים (AppHeader, Analytics…)
│   │           └── AppHeader.tsx      ← Header + Notifications + User Menu
│   │
│   ├── server/                        ← Express REST API
│   │   ├── .env.example               ← תבנית משתני סביבה (חובה!)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts               ← Bootstrap: CORS, Helmet, Routes
│   │       ├── db.ts                  ← MongoDB connection
│   │       ├── auth/
│   │       │   ├── authService.ts     ← Register, Login, OTP, Refresh
│   │       │   ├── cookies.ts         ← HttpOnly refresh token cookie
│   │       │   ├── cryptoUtil.ts      ← bcrypt + OTP hashing
│   │       │   ├── emailService.ts    ← Resend API (OTP email)
│   │       │   ├── jwtTokens.ts       ← JWT_ACCESS_SECRET (env)
│   │       │   └── userMapper.ts
│   │       ├── db/
│   │       │   └── pgPool.ts          ← PostgreSQL connection pool
│   │       ├── lib/
│   │       │   └── extractJson.ts
│   │       ├── middleware/
│   │       │   ├── csrf.ts            ← CSRF double-submit cookie
│   │       │   ├── errorHandler.ts    ← Zod errors + generic 500
│   │       │   └── requireAuth.ts     ← JWT verify middleware
│   │       ├── models/
│   │       │   └── VirtualCourtCaseSnapshot.ts  ← Mongoose schema
│   │       ├── routes/
│   │       │   ├── index.ts           ← /api router
│   │       │   ├── auth.ts            ← /api/auth (login, register, refresh, logout)
│   │       │   ├── ai.ts              ← /api/ai (proxy → AI API, keeps key server-side)
│   │       │   ├── virtualCourt2Sync.ts
│   │       │   ├── virtualCourt2Import.ts
│   │       │   └── virtualCourtAiSub.ts
│   │       └── services/
│   │           ├── realCaseImport.ts  ← ייבוא תיקים ממאגרי משפט
│   │           └── virtualCourtOpenAI.ts
│   │
│   └── mobile/                        ← Expo React Native
│       ├── app.json                   ← LexStudy, slug: lexstudy, iOS + Android bundle
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── app/
│               └── (tabs)/
│                   ├── _layout.tsx    ← Tab bar layout
│                   └── index.tsx      ← Home screen
│
├── packages/
│   └── shared/                        ← ספריית TypeScript משותפת
│       └── src/
│           └── store/
│               ├── advancedSlice.ts   ← Contract, Notification, UI state
│               ├── authSlice.ts       ← User, isAuthenticated, tokens
│               ├── themeSlice.ts
│               ├── uiSlice.ts
│               └── index.ts           ← store export (לשימוש ב-web ובshared)
│
├── config/
│   └── security.config.js             ← CSP, CORS, Rate Limit, JWT (env-based)
│
├── docs/
│   └── env.config.md                  ← תיעוד משתני סביבה
│
├── scripts/                           ← סקריפטים לפריסה ובנייה
├── tests/                             ← Playwright E2E tests
└── .github/
    ├── workflows/
    │   └── ci.yml                     ← CI: lint, build, test
    └── dependabot.yml                 ← עדכוני תלויות אוטומטיים
```

---

## התקנה ועלייה לאוויר (Dev)

```bash
# 1. שכפול הפרויקט
git clone <repo-url>
cd Lawyers-main

# 2. התקנת תלויות (root + כל packages)
pnpm install

# 3. הגדרת משתני סביבה
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env
# ערוך את הקבצים עם הערכים שלך!

# 4. הפעלת Web App (port 5852)
pnpm dev

# 5. הפעלת Server (port 4000) — בטרמינל נפרד
pnpm dev:server

# 6. הפעלת Mobile App — בטרמינל נפרד
cd apps/mobile
npx expo start
```

---

## משתני סביבה

### Web (`apps/web/.env.local`)

| משתנה | ברירת מחדל | תיאור |
|---|---|---|
| `VITE_API_URL` | `http://localhost:4000/api` | כתובת השרת — **חייב לכלול /api** |
| `VITE_SKIP_AUTH_BOOTSTRAP` | `false` | `true` בפיתוח בלבד (כשהשרת כבוי) |
| `VITE_VAPID_PUBLIC_KEY` | — | מפתח Push Notifications |
| `VITE_APP_VERSION` | `1.0.0` | גרסת האפליקציה |

### Server (`apps/server/.env`)

| משתנה | נדרש | תיאור |
|---|---|---|
| `PORT` | לא (ברירת מחדל: 4000) | פורט השרת |
| `NODE_ENV` | כן | `development` / `production` |
| `CORS_ORIGIN` | כן | כתובות מותרות, מופרדות בפסיק |
| `JWT_ACCESS_SECRET` | **כן** | לפחות 32 תווים אקראיים |
| `JWT_ACCESS_EXPIRES_SEC` | לא (900) | תוקף access token בשניות |
| `REFRESH_TOKEN_DAYS` | לא (7) | תוקף refresh token בימים |
| `DATABASE_URL` | כן | PostgreSQL URI |
| `MONGODB_URI` | כן | MongoDB URI (Virtual Court) |
| `RESEND_API_KEY` | אופציונלי | שליחת OTP במייל |
| `OPENAI_API_KEY` | אופציונלי | AI features |

> **אזהרת אבטחה:** לעולם אל תעלה קבצי `.env` לגיט. הם נמצאים ב-`.gitignore`.

---

## ארכיטקטורה טכנית

```
┌─────────────────────────────┐     ┌──────────────────────────────┐
│     Web App (React/Vite)    │────▶│   REST API (Express/Node)     │
│     Port: 5852              │     │   Port: 4000                  │
│  - Redux Toolkit (state)    │     │  - JWT Auth (HttpOnly cookie)  │
│  - Zustand (local stores)   │     │  - CSRF double-submit         │
│  - RTK Query (server cache) │     │  - Zod validation             │
│  - MUI 5 (RTL support)      │     │  - Helmet security headers    │
│  - i18next (he/en/ar)       │     │  - Rate limiting              │
└─────────────────────────────┘     └──────────┬───────────────────┘
                                               │
                     ┌─────────────────────────┤
                     │                         │
              ┌──────▼──────┐        ┌─────────▼──────────┐
              │  PostgreSQL  │        │      MongoDB        │
              │  (Auth/Users)│        │  (VirtualCourt     │
              └─────────────┘        │   Snapshots)        │
                                     └────────────────────┘
```

---

## תכונות עיקריות

### מדור לימוד משפטי (`/legal-knowledge`)
- **1,200+ שאלות** בחינה לפי סילבוס — דיני חוזים, פלילי, חוקתי, נזיקין, משפחה, עבודה, קניין
- **מבחנים מותאמים**: מהיר (10 שאלות), מקיף (50 שאלות), לפי נושא
- **משחקים**: חוק נגד מנהג, סולם הערעור, חידונים אינטראקטיביים
- **AI מאמן אישי**: מעקב נצחונות/כישלונות, ניתוח חולשות, שאלות חיזוק מותאמות
- **גלוסרי מושגים** עם 100+ מושגים, דוגמאות ומקורות חוק

### בית משפט וירטואלי (`/virtual-court-2`)
- ניהול תיק בית משפט — שופט, עורכי דין, עדים, מוצגים
- AI לניתוח טיעונים ויצירת פסק דין
- ייבוא תיקים ממאגרי משפט אמיתיים
- שמירת snapshot ל-MongoDB לסנכרון

### ניהול חוזים (`/contracts`)
- עורך טקסט עשיר + חתימה דיגיטלית
- ניתוח סיכונים AI
- תבניות: שכירות, עסקת מכר, העסקה
- גרסאות ומעקב שינויים

### CRM משפטי (`/crm`)
- ניהול לקוחות ולידים
- מעקב פעילויות

### Auth מאובטח
- JWT Access Token (זיכרון בלבד) + Refresh Token (HttpOnly cookie)
- CSRF double-submit cookie
- OTP ב-email לאימות הרשמה
- hashing: bcrypt (rounds: 12)

---

## מבנה ה-Web App

### Store (Redux)
```
store/
  auth          ← user, isAuthenticated, accessToken (memory only!)
  ui            ← loading, modals
  theme         ← light/dark/auto
  advanced      ← contracts, notifications, marketplace
  authApi       ← RTK Query (auth endpoints)
  simulatorApi  ← RTK Query (virtual court)
  riskAnalysisApi ← RTK Query (risk analysis)
```

### Routing
| נתיב | דף | הגנה |
|---|---|---|
| `/` | Home | ציבורי |
| `/login` | Login | ציבורי |
| `/register` | Register | ציבורי |
| `/dashboard` | Dashboard | Private |
| `/legal-knowledge` | LegalKnowledge | Private |
| `/contracts` | Contracts | Private |
| `/virtual-court-2` | VirtualCourt2 | Private |
| `/crm` | CRM | Private |
| `/settings` | Settings | Private |
| `*` | 404 NotFound | — |

### i18n
- ברירת מחדל: **עברית (RTL)**
- תמיכה: `he`, `en`, `ar`
- מיקום תרגומים: `src/app/i18n/{he,en,ar}/common.json`
- שינוי שפה: `setLanguage('en')` — עדכון `dir`, `lang`, localStorage

---

## מבנה השרת

### Endpoints

| Method | Path | תיאור | Auth |
|---|---|---|---|
| GET | `/health` | Health check | — |
| GET | `/api/health` | API health check | — |
| POST | `/api/auth/register` | הרשמה + OTP | — |
| POST | `/api/auth/verify-otp` | אימות OTP | — |
| POST | `/api/auth/login` | כניסה → JWT + cookie | — |
| POST | `/api/auth/refresh` | רענון token | Cookie |
| POST | `/api/auth/logout` | יציאה | JWT |
| POST | `/api/auth/resend-otp` | שליחת OTP חוזרת | — |
| POST | `/api/ai/analyze` | ניתוח חוזה (AI proxy) | JWT |
| POST | `/api/ai/alternatives` | הצעות חלופיות (AI) | JWT |
| POST/GET | `/api/virtual-court-2/*` | Virtual Court API | JWT |

### Security Middleware Stack
```
helmet() → cookieParser() → cors() → express.json() → [routes] → errorHandler
```

---

## מבנה האפליקציה הניידת

```
apps/mobile/
  app.json          ← Expo config
    name: LexStudy
    slug: lexstudy
    ios.bundleIdentifier: com.lexstudy.app
    android.package: com.lexstudy.app
  src/app/
    (tabs)/
      _layout.tsx   ← Tab navigation
      index.tsx     ← Home Screen
```

**Stack:** Expo 52 + React Native 0.76 + expo-router

---

## Auth & Security

### זרימת Authentication

```
[Client] → POST /api/auth/login
         ← { accessToken } + Set-Cookie: refreshToken (HttpOnly, Secure)

[Client] → כל בקשה: Authorization: Bearer <accessToken>
         → POST /api/auth/refresh (cookie) → accessToken חדש

[Client] → POST /api/auth/logout → מחיקת cookie
```

### CSRF Protection
- Server יוצר `csrf_token` cookie (non-HttpOnly)
- Client קורא cookie ושולח כ-`X-CSRF-Token` header
- Server מאמת תאימות — מונע CSRF attacks

### סודות נדרשים בייצור
```
JWT_ACCESS_SECRET     ← לפחות 32 תווים אקראיים
OTP_PEPPER            ← לפחות 32 תווים אקראיים
DATABASE_URL          ← PostgreSQL עם SSL
MONGODB_URI           ← MongoDB Atlas עם TLS
```

---

## עלייה לייצור (Production)

### Web Build
```bash
pnpm build        # builds apps/web to apps/web/dist
# או
cd apps/web
pnpm build
```

### Server
```bash
cd apps/server
pnpm build        # tsc → dist/
node dist/index.js
```

### Checklist לפני Production
- [ ] `VITE_SKIP_AUTH_BOOTSTRAP=false` ב-`.env.local`
- [ ] `NODE_ENV=production` בשרת
- [ ] `JWT_ACCESS_SECRET` — מחרוזת ייחודית ארוכה
- [ ] HTTPS מוגדר (nginx / load balancer)
- [ ] CORS_ORIGIN מוגדר לדומיין הייצור בלבד
- [ ] MongoDB + PostgreSQL עם SSL/TLS
- [ ] Rate limiting פעיל
- [ ] `app.set('trust proxy', 1)` כבר מוגדר בשרת

---

## App Store Deployment

### iOS (Apple App Store)

```bash
cd apps/mobile

# Install EAS CLI
npm install -g eas-cli
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

**`app.json` — הגדרות נדרשות:**
```json
{
  "expo": {
    "name": "LexStudy",
    "slug": "lexstudy",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.lexstudy.app",
      "supportsTablet": true
    }
  }
}
```

**Checklist App Store:**
- [ ] Privacy Policy URL
- [ ] App screenshots (6.5", 5.5", iPad)
- [ ] App icon 1024×1024px
- [ ] Age rating
- [ ] Bundle ID ב-Apple Developer Portal
- [ ] Provisioning Profile + Certificate

### Android (Google Play)

```bash
eas build --platform android --profile production
eas submit --platform android
```

---

## בדיקות

```bash
# Unit Tests (Vitest)
pnpm test

# E2E Tests (Playwright)
pnpm test:e2e

# Lint
pnpm lint

# Type check
pnpm typecheck
```

---

## כללי קוד ואיכות

### ESLint Rules (key)
- `@typescript-eslint/no-explicit-any`: **warn** — הימנע מ-`any`
- `unused-imports/no-unused-imports`: **error** — אל תשאיר imports מיותרים
- `react-refresh/only-export-components`: **warn** — Fast Refresh

### TypeScript
- `strict: true` — בכל packages
- פונקציות מיוצאות צריכות return type מפורש
- אין `as any` — השתמש ב-`as const` / union types / proper typing

### Git
- Branch: `main`
- אין commits ישירות ל-`main` ב-production
- CI: lint + build + test (GitHub Actions)

### Accessibility
- כל `IconButton` עם `aria-label`
- תמיכת keyboard navigation (Tab, Enter, Space)
- RTL מלא (MUI + `stylis-plugin-rtl`)
- WCAG 2.1 Level AA

---

## גרסאות עיקריות

| חבילה | גרסה | הערות |
|---|---|---|
| React | 18.2.0 | Stable |
| Vite | 5.x | Fast build |
| MUI Material | 5.18.x | RTL תמיכה מלאה |
| Redux Toolkit | 1.9.7 | Stable API |
| Zustand | 5.x | Local persistence |
| Express | 4.18.x | Stable |
| TypeScript | 5.5.x | Strict mode |
| Expo | 52.x | React Native 0.76 |
| pnpm | 9.x | Monorepo manager |
| Turbo | 2.x | Build orchestrator |

---

## רישיון

© 2026 LexStudy. כל הזכויות שמורות.
