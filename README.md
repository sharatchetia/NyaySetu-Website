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

1. **Install Frontend Dependencies**

```bash
npm install
```

2. **Run Frontend Development Server**

```bash
npm run dev
```

3. **Build for Production**

```bash
npm run build
```

---

## 🐍 Backend Virtual Environment Setup

1. **Navigate to the Backend Directory**

```bash
cd backend
```

2. **Activate Virtual Environment**

### Windows (PowerShell)

```powershell
.\.venv\Scripts\Activate.ps1
```

### Windows (CMD)

```cmd
.\.venv\Scripts\activate.bat
```

### macOS / Linux

```bash
source .venv/bin/activate
```

3. **Install Requirements (if needed)**

```bash
pip install -r requirements.txt
```

4. **Run Backend (FastAPI with Uvicorn)**

```bash
uvicorn main:app --reload
```

---

# 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Motion, Radix UI
- **Backend**: FastAPI, Python 3.13, Pydantic, Scikit-learn, Pandas, NumPy, Uvicorn

---

# 🤖 AI Consultation Workspace

The AI Consultation Workspace is an AI-assisted legal document analysis interface that helps users upload legal documents, receive summaries, identify document categories, and discover relevant lawyers.

The workspace provides a dedicated consultation environment where document analysis and lawyer recommendations are handled through a modular React architecture.

---

## ✨ Features

### 📄 Document Upload

- Legal document upload workflow.
- Document processing status updates.
- Uploaded document information displayed inside the AI consultation interface.

### 🧠 AI Document Analysis

- Generates document summaries.
- Provides document context for AI-based queries.
- Classifies uploaded documents into relevant legal categories.

### 🏷️ Document Classification

- Automatically identifies the category of uploaded documents.
- Classification results are used for lawyer recommendation.

### ⚖️ Lawyer Recommendation System

- Displays recommended lawyers based on document categories.
- Provides lawyer profile previews.
- Supports viewing detailed lawyer information.

### 💬 AI Document Chat

- Allows users to ask questions related to uploaded documents.
- Maintains document context for AI-assisted responses.

---

# 🏗️ Frontend Architecture

The AI Consultation Workspace is implemented as a modular React feature:

```text
src/app/components/consultation/
```

## Main Components

| Component | Description |
|-----------|-------------|
| `ConsultationWorkspace` | Main consultation workspace container |
| `ChatWindow` | Displays AI conversation and document analysis messages |
| `ChatComposer` | User input interface for document-related queries |
| `UploadDropzoneCard` | Document upload component |
| `LawyersPanel` | Recommended lawyers section |
| `LawyerCard` | Lawyer recommendation card |
| `LawyerProfileModal` | Lawyer profile details view |
| `ToastStack` | Notification handling component |

---

# 🔌 API Integration Layer

The consultation module contains a dedicated API abstraction layer:

```text
src/app/components/consultation/api/
```

Current API services:

```text
api/
├── upload.ts       # Document upload service
├── summarize.ts    # Document summarization service
├── classify.ts     # Document classification service
├── lawyers.ts      # Lawyer recommendation service
└── ask.ts          # Document-based AI query service
```

The current implementation uses mocked API services to simulate AI responses and maintain frontend independence.

---

# 🔮 Future Integrations

The frontend architecture is prepared for integration with:

- Document summarization AI model
- Document classification ML model
- Gemini API for document summarization
- Legal document analysis backend
- Lawyer recommendation backend
- Authentication and user-specific workflows

---

# 📌 Development Notes

- The consultation workspace is isolated from the existing landing page architecture.
- Existing UI components and styling systems are reused wherever applicable.
- Backend interactions are currently mocked for frontend development.
- The architecture allows future AI model and backend integration without major frontend restructuring.

---

# 👥 Contributors

## AI Consultation Workspace

Implemented by:

- @Noriaan

Contribution areas:

- Designed and implemented the AI consultation workspace frontend.
- Integrated document upload workflow.
- Developed AI chat interface and document interaction flow.
- Created lawyer recommendation UI components.
- Implemented modular React component architecture.
- Added API abstraction layer for future AI and backend integrations.