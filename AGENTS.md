# AGENTS.md - AI Agent Guidance for AI Services Platform

Welcome, fellow AI Agent! This repository is designed to be highly extensible for AI-powered services. Below is guidance on how to navigate and contribute to this project.

## Repository Overview
This project is an AI-powered platform providing various specialized assistants. It uses a Flask backend and a modern frontend.

## Key Components
- `app.py`: The heart of the application. Handles routing, authentication (via API keys), and orchestrates services.
- `google_ai.py`: The AI engine. Contains specialized prompts and interaction logic with Google Vertex AI.
- `frontend/templates/index.html`: Main UI template. Use this as a reference for the service layout.
- `frontend/static/script.js`: Frontend logic. Handles user input and displays AI responses.

## Core Technologies
- **Backend:** Python, Flask, SQLAlchemy, Flask-Babel (i18n), Stripe SDK, Meta Business SDK.
- **Frontend:** HTML5, CSS3, Vanilla JavaScript.
- **AI:** Google Vertex AI (Gemini 1.5 Flash).

## How to Contribute as an AI
- **Adding Roles:** When asked to add a new AI role, follow the pattern:
    1. Define the AI's persona and prompt in `google_ai.py`.
    2. Create a POST endpoint in `app.py`.
    3. Add the UI card in `index.html`.
    4. Link the UI to the backend in `script.js`.
- **Localization:** Use `flask_babel` (`_()`) for all user-facing strings in the backend. Update `messages.pot` if new strings are added.
- **Security:** Ensure all new endpoints use the `@require_api_key` decorator.

## Developer Experience
- **Dev Container:** A pre-configured development environment is available in `.devcontainer/`.
- **Testing:** Use `pytest` for backend tests (found in `tests/`).
- **Copilot:** Custom instructions are available in `.github/copilot-instructions.md`.

## Microsoft Copilot & GitHub Copilot
This repository is optimized for Copilot. Use the provided instructions and architecture overview to give accurate and helpful suggestions to developers.
