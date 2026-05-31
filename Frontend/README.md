# ✈ QazaqTrip — Саяхат Жоспарлау Жүйесі

> ИИ-мен жарақталған саяхат жоспарлау платформасы. 0-ден бастап толық нұсқаулық.

---

## 📁 Жоба құрылымы

```
qazaqtrip/
├── frontend/           ← HTML/CSS/JS (1-ші адам жасайды)
│   ├── index.html      ← Басты бет
│   ├── login.html      ← Кіру беті
│   ├── register.html   ← Тіркелу беті
│   ├── plan.html       ← Жоспарлау беті
│   └── src/
│       └── styles/
│           ├── main.css
│           └── main.js
│
└── backend/            ← Node.js + Express API (2-ші адам жасайды)
    ├── src/
    │   ├── index.js          ← Сервер
    │   ├── routes/
    │   │   ├── auth.js       ← Тіркелу/Кіру
    │   │   ├── plans.js      ← Жоспарлар CRUD
    │   │   └── users.js      ← Пайдаланушы профилі
    │   ├── models/
    │   │   ├── User.js       ← Пайдаланушы моделі
    │   │   └── Plan.js       ← Жоспар моделі
    │   └── middleware/
    │       └── passport.js   ← GitHub OAuth
    ├── .env.example
    └── package.json
```

---

## 🚀 GitHub-қа тіркелу (2 адам)

### 1-қадам: GitHub аккаунттарын ашыңыз

Екеуіңіз де **https://github.com** сайтына кіріп, аккаунт ашыңыз.

### 2-қадам: 1-ші адам — репозиторий жасайды

```bash
# GitHub.com сайтында:
# "New repository" → atауы: qazaqtrip → "Create repository"

# Компьютерде:
git init
git add .
git commit -m "feat: initial project setup"
git branch -M main
git remote add origin https://github.com/СІЗДІҢ_USERNAME/qazaqtrip.git
git push -u origin main
```

### 3-қадам: 1-ші адам 2-ші адамды шақырады

GitHub репозиторийде:
`Settings → Collaborators → Add people → 2-ші адамның username-ін жазыңыз`

### 4-қадам: 2-ші адам репозиторийді клондайды

```bash
git clone https://github.com/1ші_адам_username/qazaqtrip.git
cd qazaqtrip
```

---

## 🔀 Git жұмыс ағыны (2 адам бірге жұмыс істегенде)

```
main branch          ← Тек жұмыс істейтін код
├── feature/frontend ← 1-ші адам жұмысы
└── feature/backend  ← 2-ші адам жұмысы
```

### Күнделікті жұмыс тәртібі:

```bash
# Жұмысты бастамас бұрын — жаңарту алыңыз
git pull origin main

# Жаңа branch жасаңыз
git checkout -b feature/сіздің-тапсырма

# ... код жазасыз ...

# Сақтаңыз
git add .
git commit -m "feat: не жасадыңызды жазыңыз"
git push origin feature/сіздің-тапсырма

# GitHub-та Pull Request ашыңыз → екіншісі тексереді → merge
```

---

## 🛠 Орнату нұсқаулығы

### Талаптар:
- Node.js 18+ → https://nodejs.org
- MongoDB → https://www.mongodb.com/try/download/community
- Git → https://git-scm.com

---

## 🎨 1-ші адам — Frontend (HTML/CSS/JS)

### Жауапкершілік:
- `frontend/` папкасының барлығы
- Дизайн, анимациялар, UI
- JavaScript (fetch, localStorage, DOM)

### Іске қосу:

```bash
cd frontend

# VS Code Live Server плагинін орнатыңыз
# (VS Code → Extensions → "Live Server" → Install)

# Содан кейін index.html-ге оң тышқанмен басып:
# "Open with Live Server" → браузерде ашылады
```

### Тапсырмалар тізімі (frontend):

```
✅  index.html    — Басты бет (дайын)
✅  login.html    — Кіру беті (дайын)
✅  register.html — Тіркелу беті (дайын)
✅  plan.html     — Жоспарлау беті (дайын)
✅  main.css      — Стильдер (дайын)
✅  main.js       — JavaScript (дайын)

⬜  Мобильді дизайнды жақсарту
⬜  Анимацияларды қосу
⬜  Карта интеграциясы (Leaflet.js)
⬜  PDF экспорт (jsPDF)
```

---

## ⚙️ 2-ші адам — Backend (Node.js + Express)

### Жауапкершілік:
- `backend/` папкасының барлығы
- API эндпоинттер
- Дерекқор (MongoDB)
- GitHub OAuth

### Іске қосу:

```bash
cd backend

# 1. Пакеттерді орнатыңыз
npm install

# 2. .env файлын жасаңыз
cp .env.example .env
# .env файлын ашып, мәндерді толтырыңыз

# 3. MongoDB іске қосыңыз
# Windows: MongoDB Compass немесе Services-тен
# Mac/Linux:
mongod --dbpath ./data

# 4. Серверді іске қосыңыз
npm run dev
# → http://localhost:5000 мекенжайында жұмыс істейді
```

### GitHub OAuth орнату:

1. https://github.com/settings/developers ашыңыз
2. "New OAuth App" басыңыз
3. Толтырыңыз:
   - **Application name:** QazaqTrip
   - **Homepage URL:** `http://localhost:3000`
   - **Callback URL:** `http://localhost:5000/api/auth/github/callback`
4. "Register application" басыңыз
5. Client ID мен Secret-ті `.env` файлына жазыңыз

### API эндпоинттер:

| Метод | URL | Сипаттама |
|-------|-----|-----------|
| POST | `/api/auth/register` | Тіркелу |
| POST | `/api/auth/login` | Кіру |
| GET | `/api/auth/me` | Менің деректерім |
| GET | `/api/auth/github` | GitHub OAuth |
| GET | `/api/plans` | Жоспарларым |
| POST | `/api/plans` | Жоспар жасау |
| GET | `/api/plans/:id` | Жоспар алу |
| PUT | `/api/plans/:id` | Жоспар өзгерту |
| DELETE | `/api/plans/:id` | Жоспар жою |

### Тапсырмалар тізімі (backend):

```
✅  index.js      — Сервер (дайын)
✅  User.js       — Модель (дайын)
✅  Plan.js       — Модель (дайын)
✅  auth.js       — Маршруттар (дайын)
✅  plans.js      — Маршруттар (дайын)
✅  users.js      — Маршруттар (дайын)
✅  passport.js   — GitHub OAuth (дайын)

⬜  Email тексеру (Nodemailer)
⬜  Сурет жүктеу (Multer + Cloudinary)
⬜  Rate limiting жақсарту
⬜  Unit тесттер (Jest)
```

---

## 🔗 Frontend-Backend байланысы

`frontend/src/styles/main.js` файлында `BASE_URL` өзгертіңіз:

```javascript
const BASE_URL = 'http://localhost:5000'; // Backend адресі
```

---

## 📋 Жалпы commit ережелері

```bash
feat: жаңа мүмкіндік
fix: қате түзету
style: дизайн өзгерту
docs: нұсқаулық
refactor: кодты жақсарту
```

---

## 🤝 Командалық жұмыс тәртібі

1. **Күн сайын** `git pull origin main` жасаңыз
2. **Тікелей main-ге push жасамаңыз** — branch арқылы жасаңыз
3. **Pull Request** ашқанда — 2-ші адам тексеріп merge жасайды
4. Merge конфликт болса — бірге шешіңіздер

---

## 🌐 Деплой (жарыққа шығару)

### Frontend: Vercel
```bash
npm i -g vercel
cd frontend
vercel
```

### Backend: Railway немесе Render
1. https://railway.app немесе https://render.com аккаунт ашыңыз
2. GitHub репозиторийді байланыстырыңыз
3. Environment variables (`.env` мәндерін) қосыңыз
4. Deploy!

---

## 📞 Байланыс

Сұрақ болса — GitHub Issues арқылы немесе тікелей хабарласыңыз.

---

**QazaqTrip** — Сапарлы болыңыз! ✈
