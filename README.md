# NyaySetu

NyaySetu is a modern web platform designed to streamline legal workflows and facilitate legal access and management.

---

## 📁 Project Structure

```text
NyaySetu/
├── backend/
│   ├── .venv/            # Python virtual environment (ignored by Git)
│   └── requirements.txt  # Python package dependencies
├── src/                  # React + TypeScript frontend source code
│   ├── app/              # Application components
│   ├── assets/           # Media & visual assets
│   ├── imports/          # UI templates & imported elements
│   ├── styles/           # Global and component styling
│   └── main.tsx          # Application entry point
├── guidelines/           # Project guidelines & documentation
├── index.html            # HTML entry point
├── package.json          # Node.js dependencies & scripts
├── package-lock.json     # Lockfile for reproducible npm installs
├── vite.config.ts        # Vite configuration
├── postcss.config.mjs    # PostCSS configuration
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Python**: 3.10 or higher

---

## 💻 Frontend Installation & Setup

1. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

2. **Run Frontend Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🐍 Backend Virtual Environment Setup

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Activate Virtual Environment**:
   - **Windows (PowerShell)**:
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD)**:
     ```cmd
     .\.venv\Scripts\activate.bat
     ```
   - **macOS / Linux**:
     ```bash
     source .venv/bin/activate
     ```

3. **Install Requirements (if needed)**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Backend (FastAPI with Uvicorn)**:
   ```bash
   uvicorn main:app --reload
   ```

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Motion, Radix UI
- **Backend**: FastAPI, Python 3.13, Pydantic, Scikit-learn, Pandas, NumPy, Uvicorn