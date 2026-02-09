# 📄 AI Resume Analyzer 🚀

**Analyze your resume with AI** – get instant feedback on structure, tone, content, and ATS (Applicant Tracking System) compatibility.

> ⚠️ **Work in Progress:**  
> ✅ The app is built and deployed successfully – PDF upload & preview works perfectly.  
> ⚠️ The feedback section is currently under development. It’s in the codebase but not fully functional yet (some fields return default values).  
> 🛠️ Keeping it in the repo so I (and others) can iterate and improve!

---

## ✨ Features (Current)
✅ Upload your resume (PDF)  
✅ Preview the resume in-browser  
✅ Clean, responsive UI built with React & TailwindCSS  
✅ Uses Puter’s KV & FS APIs for storage

---

## 🔥 Features (Planned / Under Development)
🔄 AI-generated feedback on:
- Tone & Style
- Content quality
- Structure & Skills
- ATS (Applicant Tracking System) score

> The UI components (`Summary`, `ATS`, `Details`) are already integrated, but currently show placeholder values while feedback logic is being finalized.

---

## 🚀 Getting Started

### 1️⃣ Clone & Install
```bash
git clone https://github.com/sahilmane69/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
```

### 2️⃣ Run Dev Server
```bash
npm run dev
```
App runs on [http://localhost:5173](http://localhost:5173)

---

## 📂 Project Structure
```
app/
 ├─ components/
 │   ├─ Summary.tsx
 │   ├─ ATS.tsx
 │   └─ Details.tsx
 ├─ routes/
 │   └─ resume.tsx
 └─ lib/
     └─ puter.ts
```

---

## 🛠️ Tech Stack
- ⚛️ **React + TypeScript**
- 🎨 **TailwindCSS**
- 📦 **Vite**
- 🔗 **React Router**
- ☁️ **Puter KV & FS APIs**

---

## 🤝 Contributing
💡 Have ideas or fixes for the feedback section?  
Feel free to fork, open issues, or submit PRs.  
Let’s make AI-powered resume reviews even better!

---

## 📌 Notes
✅ **Deployment:** App is live and deployed successfully.  
⚠️ **Known Issue:** Feedback currently returns default values. The code remains in the repo to showcase ongoing development.

---

## 📜 License
MIT © [Sahil Mane](https://github.com/sahilmane69)

---

## ✨ LinkedIn Post ✨

🚀 **Just deployed my new project – AI Resume Analyzer!** ✨  

📄 Upload your resume, preview it instantly in the browser, and (soon) get **AI-powered feedback** on tone, content, structure, skills, and ATS compatibility.

✅ **What works now:**
✔️ Smooth resume upload & PDF preview  
✔️ Clean and responsive UI  
✔️ Deployed & running!  

⚠️ **What’s cooking:**  
The feedback section is still under development — right now it shows placeholder values, but the foundation is ready in the codebase for future iterations.

💡 I’m keeping the feedback code in the repo to show ongoing progress and for anyone who wants to contribute!

🔗 **Check out the repo:**  
👉 [github.com/sahilmane69/ai-resume-analyzer](https://github.com/sahilmane69/ai-resume-analyzer)

Would love to hear your thoughts, ideas, or contributions! 💪🔥  

#WebDevelopment #ReactJS #TailwindCSS #AI #LearningInPublic #ShowYourWork #BuildInPublic
