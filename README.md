# 🧾 TaxWise

TaxWise is a web application that lets users upload CSV files, processes financial data, and generates interactive tax-related visualizations.

This repository contains the frontend built with React (Vite). The backend for processing uploads and serving API endpoints is implemented as a Python API (assumed FastAPI / Uvicorn) running separately.

If your current backend is a different Python framework, the instructions below are still relevant — replace the command / package manager steps with your framework's equivalents.

---

## ✨ Features
- Upload CSV files containing financial/tax data.
- Backend processing using a Python API.
- Interactive charts with Plotly.js.
- Modern responsive UI using React and TailwindCSS / shadcn/ui.
- Toast notifications for user actions.

---

## 🛠️ Tech Stack

Frontend
- React (Vite)
- Plotly.js
- TailwindCSS / shadcn/ui

Backend (Python API)
- Python 3.8+
- FastAPI (recommended) or another Python web framework
- Uvicorn (ASGI server)
- CSV parsing with pandas or Python csv module

---

## 📦 Local setup

Assumptions made in this README:
- The frontend uses Vite and will run on http://localhost:5173.

If your Python API uses a different port, set the frontend env variable accordingly (see "Configuring the frontend base URL").

### 1. Clone the repository

```bash
git clone https://github.com/your-username/TaxWise.git
cd TaxWise
```

### 3. Frontend (Vite + React)

Install frontend dependencies and run the dev server:

```bash
npm install
npm run dev
```

By default Vite serves the frontend at `http://localhost:5173`.

---

## Configuring the frontend base URL

The frontend talks to the Python API. Configure the API base URL using an environment variable for Vite.

Create an `.env.local` (or `.env`) file in the project root with:

```env
VITE_API_BASE_URL=http://localhost:8000
```

In the frontend code access it via `import.meta.env.VITE_API_BASE_URL` (Vite convention). Example:

```js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
fetch(`${API_BASE}/upload`, { method: 'POST', body: formData })
```

---

## 🚀 Usage flow

2. Start the frontend (`npm run dev`).
3. Open `http://localhost:5173` in your browser.
4. Use the UI to upload CSV files. The frontend will POST the file to an endpoint such as `/upload` on the Python API.

Example API endpoints (adjust to your implementation):
- POST /upload — accepts multipart/form-data CSV file and returns processing result
- GET /status — optional health/status endpoint
- GET /reports/{id} — retrieve processed report or chart data

---

## Environment & deployment notes

- Build the frontend (`npm run build`) and serve the `dist` folder via a static server or integrate into the Python backend to serve static files.

---

## Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/awesome-feature
```

3. Commit and push your changes

```bash
git add .
git commit -m "Add new feature"
git push origin feature/awesome-feature
```

4. Open a Pull Request

---

## License

MIT
