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
| `VITE_POSTHOG_KEY` | ריק = כבוי | PostHog project API key (analytics) |
| `VITE_POSTHOG_HOST` | `https://us.i.posthog.com` | Endpoint של PostHog |
| `VITE_SOCKET_URL` | ריק = נגזר מ-`VITE_API_URL` | Origin של Socket.io (ללא `/api`) |

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
| `STRIPE_SECRET_KEY` | כן לתשלומים | מפתח Secret מ-Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | כן לתשלומים | Secret של endpoint ה-Webhook |
| `STRIPE_PRICE_PRO_MONTHLY` | כן למסלול Pro | Price ID של מוצר Pro חודשי |
| `STRIPE_PRICE_PREMIUM_MONTHLY` | כן למסלול Premium | Price ID של מוצר Premium חודשי |
| `PROMO_ENDS_AT` | אופציונלי | מבצע השקה: תאריך סיום ISO-8601 (עם אזור זמן). בלי ערך — אין בוסט ל-Free |
| `PROMO_FREE_AI_PER_DAY` | אופציונלי | במבצע: מכסת קריאות AI יומית למשתמשי Free (ברירת מחדל 25; VC LLM + RAG) |
| `CLIENT_ORIGIN` | אופציונלי | URL בסיס ללקוח (לבניית success/cancel URL) |
| `POSTHOG_KEY` | אופציונלי | Project API Key (server-side events) |
| `POSTHOG_HOST` | אופציונלי | ברירת מחדל: `https://us.i.posthog.com` |

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

### תשלומים ומנויים (`/pricing`, `/account/billing`)

LexStudy פועל במודל **Freemium** עם 3 מסלולים:

| מסלול | מחיר | מיועד ל- | כולל |
|---|---|---|---|
| **Tier 1 — Free** | ₪0 | היכרות וסטודנטים | **עד 20 שאלות ביום**, **Virtual Court בסיסי** (תיקים מקומיים; ללא LLM לייצור תיק / שופט AI) |
| **Tier 2 — Student Pro** | ₪49/חודש | מתכוננים ללשכה | כל 1,200+ השאלות ללא הגבלה יומית, AI Coach ללא הגבלה, Virtual Court מלא |
| **Tier 3 — Lawyer / Expert** | ₪99/חודש | עורכי דין מתמחים | כל Student Pro + **ניתוח סיכונים בחוזים** + **ייבוא תיקים ופסיקה מהרשת** |

**ארכיטקטורת החיוב:**
- **Web — Stripe Checkout** — hosted payment page (PCI compliant)
- **Mobile — RevenueCat** (`react-native-purchases`) — שכבת IAP מאוחדת ל-iOS/Android; entitlement ברירת מחדל `pro_access` (משתנה דרך `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT`).
- **Stripe Billing Portal** — ניהול מנוי + חשבוניות + ביטול
- **Webhook עם raw body + dedup** — סנכרון מצב מנוי מאמין
- **PostgreSQL** שומר `billing_customers` + `billing_subscriptions` + `billing_webhook_events` + `user_daily_question_usage` (מכסת Free) + `user_daily_ai_usage` (מכסת AI במבצע השקה)
- **`<PaywallGate flag="…">`** — Web; דגלים: `aiCoach`, `adaptiveDrills`, `virtualCourtLimited`, `virtualCourtFull`, `realCaseImport`, `contractRiskAnalysis`, `unlimitedExamQuestions`
- **Virtual Court:** לאחר הרשמה, `/virtual-court-2` זמין עם `virtualCourtLimited`; קריאות `POST /api/ai/virtual-court/*` דורשות JWT + `virtualCourtFull` (402 אחרת) + מכסת AI במבצע. הלקוח שולח Bearer + CSRF.
- **`requireEntitlement('flag')`** — middleware שרת שחוסם פיצ'רים גם ברמת API
- **מכסת Free יומית:** `POST /api/billing/usage/question` מחזיר 429 כשחוצים 20; ה-UI מציג באנר `used / limit` ונועל את המשך התרגול
- **מבצע השקה (`PROMO_ENDS_AT`):** משתמשי **Free** מקבלים יכולות **Student Pro** (בלי `realCaseImport` / `contractRiskAnalysis`). שאלות תרגול ללא מגבלת 20/יום. **שירותי AI** (VC LLM, `POST /legal/rag/*`) עוברים `requireAiMarginalBudget`: במבצע — עד `PROMO_FREE_AI_PER_DAY` ליום; אחרי המבצע Free מקבל 402 על נתיבי AI אלה.
- **Web — חובת הרשמה:** מסלולי מוצר (דשבורד, לימוד, VC וכו') עטופים ב-`RequireRegistration` — אורחים מופנים ל-`/register?next=…` (דפי שיווק: `/`, `/landing`, `/login`, `/register`, `/pricing`, `/billing/success`).
- **Cache תשובות AI (`ai_response_cache` ב-MongoDB):** כל קריאת embedding / VC LLM / RAG answer ממופה ל-`sha256(scope + payload)`. תשובה זהה נשלפת חינם מהקאש (ttl 45–180 יום) — זה שומר עלויות גם אם סטודנטים שואלים אותה שאלה. אם Mongo לא מחובר — fail-open וקריאה ישירה ל-OpenAI.

**הפעלה (מצב Test):**

```powershell
# 1. צור חשבון ב-Stripe ומפעיל Test mode
# 2. צור 2 Products + Prices (Pro Monthly, Premium Monthly)
# 3. הוסף ל-apps/server/.env:
#    STRIPE_SECRET_KEY=sk_test_...
#    STRIPE_PRICE_PRO_MONTHLY=price_...
#    STRIPE_PRICE_PREMIUM_MONTHLY=price_...

# 4. הרץ את מיגרציית החיוב + מכסה יומית
psql $env:DATABASE_URL -f apps/server/sql/billing/001_subscriptions.sql
psql $env:DATABASE_URL -f apps/server/sql/billing/002_daily_question_usage.sql

# 5. הפעל Stripe CLI לבדיקת webhook מקומי
stripe listen --forward-to http://localhost:4000/api/billing/webhook
# העתק את whsec_... ל-STRIPE_WEBHOOK_SECRET

# 6. הרץ שרת + web, כנס ל-/pricing ועשה checkout עם כרטיס 4242 4242 4242 4242
```

**Mobile (RevenueCat) — הפעלה:**
```powershell
# 1. npx expo install react-native-purchases (כבר קיים ב-apps/mobile)
# 2. ב-RevenueCat Dashboard: צור Project + App (iOS/Android), הגדר Entitlement (pro_access)
# 3. חבר מוצרים מ-App Store Connect / Google Play Console ל-Offerings
# 4. מלא ב-apps/mobile/.env:
#    EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...
#    EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_...
#    EXPO_PUBLIC_REVENUECAT_ENTITLEMENT=pro_access
# 5. IAP דורש Dev Build נייטיב — לא עובד ב-Expo Go:
#    eas build --profile development --platform ios
```
ה-hook `useSubscription()` (`apps/mobile/src/hooks/useSubscription.ts`) מאתחל את ה-SDK רק כשיש מפתחות, מאזין ל-`customerInfoUpdate`, וחושף `{ isPro, ready, available, offering, purchasing, refresh, loadOfferings, purchasePackage, restorePurchases }`. המסך `app/(tabs)/profile.tsx` מציג סטטוס חי, רשימת חבילות עם `priceString` מקומי של ה-Store וכפתור שחזור רכישות. בלי מפתחות — no-op (`isPro=false`, `ready=true`, `available=false`).

### דף נחיתה / רשימת המתנה (`/landing`)

לוכדים לידים לפני השקה מלאה:
- **Route:** `apps/web/src/pages/Landing/index.tsx` — Hero (כחול נייבי + זהב), בעיה/פתרון, פיצ'רים, טופס waitlist.
- **API:** `POST /api/marketing/waitlist` (`email`, `source`), unique על email, שולח מייל אישור דרך Resend אם `RESEND_API_KEY` מוגדר.
- **מיגרציה:** `psql $env:DATABASE_URL -f apps/server/sql/marketing/001_waitlist.sql`.

### Analytics ו-Conversion Funnel (PostHog)

LexStudy משתמש ב-PostHog לאנליטיקת מוצר + funnel תשלומים. כל מפתחות האירועים מוגדרים במקום אחד ב-`apps/web/src/features/analytics/events.ts` — ללא strings קשיחים בקוד.

**אירועים מרכזיים (Paywall funnel):**

1. `paywall.viewed` — כאשר `PaywallGate` מציג חסימה (עם `flag`, `current_plan`)
2. `paywall.cta_clicked` — לחיצה על "שדרגי" / "השוואת מסלולים"
3. `pricing.viewed` — פתיחת `/pricing`
4. `checkout.started` — התחלת Stripe Checkout
5. `checkout.completed` — הגעה לדף ה-success (client-side)
6. `checkout.completed_server` — webhook אישר (server-side, אמת)
7. `subscription.created/updated/deleted` — נשלח משרת בעקבות webhook
8. `billing.portal_opened` — פתיחת לוח Stripe

**אירועים נוספים:** `$pageview` (אוטומטי בכל שינוי route), `auth.login_completed`, `exam.started/completed`, `virtual_court.case_created`.

**הפעלה:**
1. צרי חשבון חינם ב-[PostHog Cloud](https://posthog.com) → Project → Project Settings → Project API Key
2. הדביקי את ה-key ב-`VITE_POSTHOG_KEY` (לקוח) וגם ב-`POSTHOG_KEY` (שרת — לאימותי webhook)
3. ב-PostHog → Insights → Funnels, בני funnel: `pricing.viewed` → `checkout.started` → `checkout.completed_server` — זה אחוז ההמרה שלך

> **פרטיות:** אם `VITE_POSTHOG_KEY` ריק, הלקוח ב-no-op מלא (לא טוען את ה-SDK). השרת זהה ל-`POSTHOG_KEY`.

### Realtime — בית המשפט הוירטואלי (Socket.io)

במקום polling של REST בלולאה, LexStudy משתמש ב-Socket.io לזרימה דו-כיוונית בזמן אמת:

- **שרת:** `apps/server/src/realtime/socketServer.ts` מאזין על אותו פורט של Express (http + WS multiplex).
- **JWT Auth:** כל חיבור חייב `auth.token` תקף — אותו Access Token של REST, מאומת דרך `verifyAccessToken()`.
- **Rooms:** כל תיק וירטואלי הוא חדר נפרד (`court:<caseId>`). פעולת `court:join` מצרפת את ה-socket לחדר. בנוסף, כל משתמש מצטרף אוטומטית ל-`user:<userId>` — שם נשלחות התראות אישיות (`notification:new`) בכל הטאבים.
- **Broadcast מ-AI:** `POST /api/ai/virtual-court/judge-analysis` ו-`/generate-case` משדרים `court:ai_typing` לפני קריאת LLM ו-`court:ai_response` אחרי — כל הלקוחות בחדר מקבלים מיידית ללא רענון.
- **הודעת מרצה / מתאם לחדר:** `POST /api/virtual-court-2/cases/:caseId/announce` (JWT + CSRF) — גוף `{ "title", "body" }` משדר `court:announcement` לכל מי שבחדר התיק. בלקוח: כפתור «הודעה לחדר (Realtime)» בדף פרטי התיק, וההודעה מופיעה גם במגש ההתראות (`notificationService`).
- **גשר גלובלי:** `RealtimeSocketBridge` ב-`main.tsx` מאזין ל-`notification:new` ומזין את אותו מגש שמציג `RealtimeNotifications` ב-NavBar.
- **לקוח:** `useCourtSocket(caseId)` ב-`apps/web/src/features/realtime/useCourtSocket.ts` מחזיר `{ connected, typing, lastMessage, participants }`. ה-VirtualCourt2CaseDetailPage מציג Chip של "Realtime מחובר" ו"N משתתפים בחדר".
- **התנתקות:** `signOut` קורא ל-`disconnectSocket()` כדי לסגור את ה-WebSocket ולמנוע שימוש בטוקן ישן.
- **Reconnect:** אוטומטי — `socket.io-client` מגדיר retry אינסופי עם backoff (1s → 10s).

**קונפיגורציה:** השאירי `VITE_SOCKET_URL` ריק בפיתוח — נגזר אוטומטית מ-`VITE_API_URL` (חותכים `/api`). בפרודקשן הגדירי מפורשות (למשל `wss://api.lexstudy.co.il`). `CORS_ORIGIN` בשרת חייב לכלול את מקור הלקוח — אותה הגדרה של REST.

### Offline First — תרגול ברכבת

TanStack Query + `localStorage` persister שומרים את כל תשובות ה-API ב-24 שעות האחרונות:

- **`PersistQueryClientProvider`** ב-`apps/web/src/main.tsx` עוטף את כל האפליקציה.
- **`gcTime: 24h`, `networkMode: 'offlineFirst'`** — שאילתות שלא קיבלו רשת משתמשות בקאש המקומי.
- **Sensitive keys excluded:** `['auth', 'billing', 'csrf', 'stripe']` לא נשמרים לדיסק — לעולם לא מחזירים entitlement/session שהוקפא.
- **Mutations:** React Query משהה mutations כשאין רשת ומפעיל אוטומטית בחזרה לקליטה.
- **`OfflineBanner`** (`apps/web/src/features/offline/OfflineBanner.tsx`) מציג sticky בעת ניתוק, נעלם אוטומטית בחזרה.
- **Service Worker** (`apps/web/public/sw.js`) מבצע cache-first על static assets בלבד; לא נוגע ב-`/api/*` וב-WebSocket upgrades — כך לא מתנגש עם TanStack persister או עם Socket.io.

### RAG — מאגר ידע משפטי (pgvector + OpenAI)

LexStudy תומך ב-**Retrieval-Augmented Generation**: שליפה סמנטית מ-PostgreSQL (הרחבת `vector`), והזרקת קטעים ל-LLM כדי להפחית המצאות ולחייב ציטוט מקורות.

| רכיב | מיקום |
|---|---|
| מיגרציה | `apps/server/sql/legal/001_legal_knowledge_base.sql` — טבלה `legal_knowledge_base`, פונקציה `match_legal_documents` |
| Embeddings | `apps/server/src/services/openaiEmbeddings.ts` — `text-embedding-3-small` (1536), retry אוטומטי על **429**, ו־`createEmbeddingsBatched()` לאצ'ים עם השהיה |
| שליפה + ניסוח | `apps/server/src/legal/legalRagService.ts` — `searchLegalKnowledge`, `answerWithRag`, `retrieveContextForPrompt` |
| API משתמש מחובר | `POST /api/legal/rag/query` (תשובה מלאה), `POST /api/legal/rag/search` (שליפה בלבד) |
| API אדמין | `GET/POST/PATCH ...` תחת `/api/admin/legal-knowledge/*` — **רק `role: admin`** |
| דשבורד Web | `/admin/vectors` — סטטיסטיקה, טבלה, Playground, שאילתת RAG, הוספת מסמך |
| נייד | `apps/mobile` — טאב «מאמן AI», `useLegalAI` + `EXPO_PUBLIC_API_URL` |
| דוגמת הזנה | `pnpm ingest:legal-sample` מתוך `apps/server` (אחרי מיגרציה + `OPENAI_API_KEY`) |

**הפעלה:**

1. ב-Supabase (או Postgres): תחת **Database → Extensions** הפעילי `vector`, ואז הריצי את `001_legal_knowledge_base.sql`.
2. **אימות ההרחבה:** `SELECT * FROM pg_extension WHERE extname = 'vector';` — אמורה להופיע שורה אחת (`extname = vector`).
3. הגדירי `OPENAI_API_KEY` (ואופציונלית `OPENAI_EMBEDDING_MODEL`).
4. אכלסי נתונים: דרך הדשבורד `/admin/vectors` או `pnpm ingest:legal-sample` (בסקריפט: השהיה בין מסמכים — `INGEST_DELAY_MS`, ברירת מחדל 350). לנפח גדול: אצ'ים קטנים + `createEmbeddingsBatched()` כדי להימנע מ-**429** מ-OpenAI.
5. קבעי משתמש כאדמין: `UPDATE auth_users SET role = 'admin' WHERE LOWER(email) = LOWER('you@example.com');`  
   **אבטחה:** נתיבי `/api/admin/legal-knowledge/*` עוברים `requireAuth` ואז `requireAdmin`. ה-`role` נקרא מ-**PostgreSQL בכל בקשה** (`getUserFromBearer` → `findUserById`) — לא מ-JWT; שינוי role ב-DB נכנס לתוקף מיד.
6. (אופציונלי) **שופט AI עם RAG:** `LEGAL_RAG_IN_JUDGE=true` — הקשר מהמאגר מוזרק ל-prompt של `llmJudgeAnalysis` (וגם `LEGAL_RAG_MATCH_THRESHOLD`, `LEGAL_RAG_MATCH_COUNT`, `LEGAL_RAG_VERIFIED_ONLY`).

**401 בלקוח (Web):** `authJson` / `authJsonWithBearer` מפעילים `triggerUnauthorized()` כשמתאים (Bearer תמיד; `authJson` רק אם יש session פעילה). `SessionAuthProvider` רושם handler שמנקה session ומפנה ל-`/login?reason=session`. **Axios** (`axiosClient`) משתמש ב-`getSyncAccessToken()` (מסונכרן מה-Provider) ובאותו טיפול ב-401.

**401 ב-Mobile:** `useLegalAI` קורא ל-`notifyMobileUnauthorized()`; `MobileUnauthorizedRegistrar` ב-`_layout` מנווט ל-`/` (החלף לנתיב login כשיהיה מסך התחברות).

**ערך עסקי:** מאגר מאומת (`verification_status = verified`) ניתן לשווק כמנוי פרימיום; Playground באדמין מאפשר לבדוק citations לפני שמשתמשים רואים תשובה.

### Auth מאובטח
- JWT Access Token (זיכרון בלבד) + Refresh Token (HttpOnly cookie)
- CSRF double-submit cookie
- OTP ב-email לאימות הרשמה
- hashing: bcrypt (rounds: 12)
- **פקעת session / 401:** ראו לעיל (RAG) — גשר לא מפנה על כישלון התחברות רגיל (`authJson` ב-401 רק כשכבר יש `accessToken` בזיכרון)

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
