# 🔧 Code Refiner AI

Paste messy code. Get clean, optimized code back — instantly.

Built at **Generative AI Hackathon 2026** by Sanjana Adigoppula.

---

## The Problem

Beginners often write code that works but is slow, repetitive, or hard to read — and don't always know how to fix it. Most online tools either just format code (indentation only) or require you to already know what's wrong.

## The Solution

Code Refiner takes any pasted code and:
- Rewrites it to be faster and more efficient
- Reduces time complexity where possible
- Converts it between languages (e.g. Java → Python, C++ → JavaScript)
- Answers coding questions through a built-in AI chatbot

## Live Demo

👉 [code-optimize-frontend.onrender.com](https://code-optimize-frontend.onrender.com)

## Screenshot

<img width="1322" height="806" alt="coderefine" src="https://github.com/user-attachments/assets/783a846b-c03b-49d3-a64c-a52b9a4b162a" />

## Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** Node.js, Express.js
**AI:** Groq API (code optimization + chatbot)

## Run It Locally

```bash
git clone https://github.com/adigoppulasanjana13-eng/CodeRefine.git
cd CodeRefine/backend
npm install
```

Create a `.env` file inside `backend/`:
```
GROQ_API_KEY=your_groq_api_key_here
```
Get a free key at [console.groq.com](https://console.groq.com).

```bash
npm start
```
Open `http://localhost:3000` in your browser.

## Project Structure

```
CodeRefine/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## About

Built solo during a hackathon — identified that beginners struggle to write efficient code and built a tool to solve that directly, using the Groq API for optimization and chat.

**Sanjana Adigoppula** — 3rd Year CSE, Anurag University, Hyderabad
[GitHub](https://github.com/adigoppulasanjana13-eng)
