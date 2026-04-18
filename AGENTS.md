# AGENTS.md - AI Agent Guidance for AI Services Platform

Welcome, fellow AI Agent! This repository is designed to be highly extensible for AI-powered services. Below is guidance on how to navigate and contribute to this project.

## Repository Overview
This project is an AI-powered platform providing various specialized assistants. It uses a Flask backend and a modern frontend.

## Key Components
- `app.py`: The heart of the application. Handles routing, authentication (via API keys), and orchestrates services.
- `google_ai.py`: The AI engine. Contains specialized prompts and interaction logic with Google Vertex AI / OpenAI.
- `marketplace-frontend/src/App.tsx`: Modern React marketplace frontend (Primary UI).
- `marketplace-frontend/src/api.ts`: API service definitions for the frontend.
- `docs/`: Production build of the React frontend, hosted on GitHub Pages.

## Core Technologies
- **Backend:** Python, Flask, SQLAlchemy, Flask-Babel (i18n), LangChain, Langflow.
- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, Lucide React.
- **AI:** Google Vertex AI (Gemini 1.5 Flash), OpenAI (GPT-4o).

## How to Contribute as an AI
- **Adding Roles:** When asked to add a new AI role, follow the pattern:
    1. Define the AI's persona and prompt in `google_ai.py`.
    2. Create a POST endpoint in `app.py`.
    3. Add the service definition to `AI_SERVICES` in `marketplace-frontend/src/App.tsx`.
    4. Add the API call to `marketplace-frontend/src/api.ts`.
    5. Ensure the service execution is handled in `handleServiceExecution` in `App.tsx`.
- **Localization:** Use `flask_babel` (`_()`) for all user-facing strings in the backend. Update `messages.pot` if new strings are added.
- **Security:** Ensure all new endpoints use the `@require_api_key` decorator.

## Developer Experience
- **Dev Container:** A pre-configured development environment is available in `.devcontainer/`.
- **Testing:** Use `pytest` for backend tests (found in `tests/`).
- **Copilot:** Custom instructions are available in `.github/copilot-instructions.md`.

## Microsoft Copilot & GitHub Copilot
This repository is optimized for Copilot. Use the provided instructions and architecture overview to give accurate and helpful suggestions to developers.
