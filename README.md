# AI Agent: Software Engineer, Debugger, Marketer, and System Analyzer

This project is a web-based AI agent that can perform several roles to assist with software development and business tasks.

## Devpost Challenge Submission

This project is a submission for the **[Name of Devpost Challenge]**.

*   **Live Demo:** [https://yendoukoa.google.ai](https://yendoukoa.google.ai)
*   **Video Walkthrough:** [Link to Video Walkthrough]

## Sponsorship

If you find this project useful, please consider sponsoring us!

[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=for-the-badge&logo=github-sponsors)](https://github.com/sponsors/GYFX35)
[![Sponsor](https://img.shields.io/badge/Sponsor-Stripe-626cd9?style=for-the-badge&logo=stripe)](https://buy.stripe.com/example)

### How It Works

Our platform connects to multiple AI providers (Google Vertex AI and OpenAI) to provide a comprehensive suite of tools for developers and entrepreneurs. The core is a Flask-based backend serving a modern React marketplace (powered by Tailwind CSS v4).

**Key Technologies:**
- **LangChain & Langflow:** Orchestrating complex AI workflows and autonomous agents.
- **Multi-Provider Support:** Seamlessly switching between Gemini 1.5 and GPT-4o based on the task.
- **React & Tailwind v4:** A high-performance, dark-mode-ready UI/UX for a premium user experience.

## Features

### AI Service Marketplace
Our new React-based marketplace offers a variety of specialized AI services:
- **ChatGPT Assistant:** High-quality responses powered by OpenAI's GPT-4o.
- **AutoGPT Agent:** Autonomous AI agent using LangChain to break down and solve complex goals.
- **Langflow Executor:** Run complex AI workflows defined in Langflow.
- **Technical Specialists:** Expert assistance for Website Development, Backend Architecture, Blockchain, and more.
- **Industry Experts:** Specialized AI for Fintech, Legal, Medical Diagnostic (Oncology/Cardiology), and Aerospace.

### Legacy Tools (HTML/JS Frontend)
- **Software Engineer:** Generates multi-section HTML and CSS for static websites.
- **Debugger:** Lints HTML and CSS code for basic errors.
- **Marketer:** Creates promotional social media posts.
- **System Analyzer:** Scans website URLs for broken links.

## How to Use

### Software Engineer
The Software Engineer agent uses a simple, indented syntax to define the components of a website. Provide a description in the "Software-Engineer" text box, and the agent will return the HTML and CSS code in the response box below.

**Example Prompt:**
```
title: My Photography Portfolio
header: Jane Doe | Photographer
section: About Me
  text: I am a professional photographer specializing in landscapes.
section: Gallery
  images: 4
footer: Copyright © 2024 Jane Doe
```

### Debugger
The Debugger agent can analyze code in two ways:
1.  **Paste Code:** Paste your HTML or CSS code directly into the large text area.
2.  **Use a GitHub URL:** Paste the URL of a public file on GitHub into the smaller URL input field.

The agent will automatically fetch the code from the URL and analyze it.

### System Analyzer
Enter a full website URL (e.g., `https://example.com`) to scan the page for broken links.

## Setup and Installation

### Prerequisites
- Python 3.x
- `pip` for installing Python packages

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GYFX35/AI-services.git
   cd AI-services
   ```

2. **Set up a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create a `.env` file:**
   - Copy the `.env.example` to `.env` and fill in your API keys.
   ```bash
   cp .env.example .env
   ```

### Running the Application

1. **Initialize the database:**
   ```bash
   flask init-db
   ```

2. **Start the server:**
   ```bash
   flask run
   ```

3. **Open your web browser:**
   Navigate to `http://127.0.0.1:5000` to access the application.

## Developer Deployment and Integration

This project is configured for easy use across multiple platforms.

### Git and GitLab
- **Git Attributes:** Consistent line endings are managed via `.gitattributes`.
- **GitLab CI/CD:** A `.gitlab-ci.yml` is provided for automated builds, testing with `pytest`, and linting.
  - Simply push to GitLab to trigger the pipeline.
  - Ensure you set your environment variables (from `.env.example`) in GitLab CI/CD settings.

### Firebase and Firebase Studio
- **Hosting and Functions:** Use `firebase.json` and `.firebaserc` for deployment.
- **Firebase Studio:** Compatible with Firebase tools for project management.
- **Deploy command:**
  ```bash
  firebase deploy
  ```

### AWS (Amazon Web Services)
- **Containerized Deployment:** A `Dockerfile` and `docker-compose.yml` are included.
- **AWS SAM (Serverless Application Model):** A `template.yaml` is provided for deploying as an AWS Lambda function with API Gateway.
- **Deploy via SAM:**
  ```bash
  sam build
  sam deploy --guided
  ```

### Google Cloud Platform (GCP)
- **App Engine:** Deploy using `app.yaml`.
  ```bash
  gcloud app deploy
  ```
- **Cloud Run via Cloud Build:** Use `cloudbuild.yaml` for automated container builds and deployment.
  ```bash
  gcloud builds submit --config cloudbuild.yaml
  ```

### Lablab.ai and Devpost
- **Hackathon Ready:** This repository includes all necessary configuration for quick cloning and deployment during hackathons.
- **Project Story:** (Add your project's inspiration and goals here for your submission).
- **One-Click Setup:** Use the provided Docker and Cloud configurations to get your demo live in minutes.

---
*Developed for [Hackathon Name]*
