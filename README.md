# 🧠 Snackhack 🍳

Snackhack is a fullstack AI-powered fridge recipe finder app. Just enter ingredients you have in your fridge, and it generates delicious recipes with realistic images using GPT-4 and DALL·E.

Built with:
- ⚛️ React + Vite + Tailwind CSS (frontend)
- 🐍 Flask (backend)
- 🤖 OpenAI API (GPT-4 + DALL·E for images)

---

## 🚀 Features

- Ingredient input with tag-style autocomplete
- Filtering (Vegetarian, Under 30 Min, etc.)
- Dark/light mode toggle
- Like & save recipes (locally stored)
- GPT-powered recipe generation
- AI-generated food images (via DALL·E 2)

---

## 🛠 Getting Started

### 🔧 Prerequisites

- Node.js (v18+ recommended)
- Python 3.10+
- An [OpenAI API Key](https://platform.openai.com/account/api-keys)

---

## 📦 Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-username/snackhack.git
cd snackhack
```

---

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: [http://localhost:5173](http://localhost:5173)

---

### 3. Backend (Flask + OpenAI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```
OPENAI_API_KEY=your-openai-key-here
```

Then run the server:
```bash
python app.py
```

Backend runs on [http://localhost:5000](http://localhost:5000)

---

## 🧪 Example Usage

1. Go to the frontend in your browser.
2. Add ingredients like: `chicken`, `pasta`, `cheese`
3. Click **Cook**.
4. Wait ~5–10s (image generation takes time).
5. Scroll through generated recipes.

---

## 💸 API Notes

- DALL·E 2 is used for images (cheaper + 512x512 support)
- API rate limit: 5 images/min (use fallback images if needed)
- GPT-4 or 3.5 Turbo used for recipe generation

---

## 📁 File Structure

```
/frontend         → React + Tailwind UI
/backend          → Flask API & GPT logic
/images           → Optional logos & assets
README.md
.gitignore
```

---

## ✨ Future Improvements

- User login & recipe saving
- Mobile PWA support
- Multiple image quality options
- Upload your own fridge photo

---

## 🧑‍💻 Made by Nikola Ilić
Junior Front-End Developer | React · Flask · Tailwind
