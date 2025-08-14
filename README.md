# AI Agent: A Multi-Role Assistant

This project is a web-based AI agent that can perform several roles to assist with software development, business, and educational tasks.

## Features

- **Software Engineer:** Generates multi-section HTML/CSS for a static website or simple Python scripts.
- **Debugger:** Lints HTML and CSS code to find basic errors. Can analyze pasted code or fetch a file directly from a GitHub URL.
- **Marketer:** Creates promotional social media posts from a business description.
- **System Analyzer:** Scans a website URL for broken links and suggests search queries to find solutions.
- **Designer:** Finds royalty-free images/videos, generates CSS animation scripts, and suggests color palettes.
- **Educator:** Takes any question and provides a direct link to Google search results.
- **Cybersecurity Analyst:** Scans a website's HTTP headers and reports on key security headers.
- **Business Developer:** Generates a business plan outline and suggests SEO keyword research queries for a startup idea.
- **Public Services:** Provides links to authoritative resources on topics like climate change, agriculture, and biodiversity.
- **Git Helper:** Generates a shell script with the necessary Git commands to create a branch, commit, and push changes.
- **Scam Tracker:** Analyzes a URL for common signs of being a scam or phishing site.

## How to Use

### Software Engineer
The Software Engineer agent can generate two types of code:
- **To build a website:** Use a simple, indented syntax to define the components of a website.
- **To generate a script:** Ask for a script in plain language, e.g., `a python script to print hello world`.

### Debugger
The Debugger agent can analyze code in two ways:
1.  **Paste Code:** Paste your HTML or CSS code directly into the large text area.
2.  **Use a GitHub URL:** Paste the URL of a public file on GitHub into the smaller URL input field.

### System Analyzer
Enter a full website URL (e.g., `https://example.com`) to scan the page for broken links.

### Designer
The Designer agent can help you with visual assets and animations.
- **To find images/videos:** Use prompts like `a photo of a sunset`.
- **To generate animations:** Use prompts like `a script for a fade in animation`.
- **To get a color palette:** Use prompts like `suggest a color palette`.

### Educator
Ask any question in the "Educator" text box to get a link to the Google search results.

### Cybersecurity Analyst
Enter a full website URL (e.g., `https://example.com`) in the "Cybersecurity" input field to get a report on its security headers.

### Business Developer
The Business agent can help you with your startup idea.
- **To generate a business plan:** Enter your startup idea, e.g., `an app for dog walkers`.
- **To get keyword ideas:** Enter a prompt including the word "keywords", e.g., `keywords for a dog walking app`.

### Public Services
Ask for information on a supported public topic. The agent will return a list of helpful, authoritative links.
- **Supported topics:** `climate change`, `agriculture`, `biodiversity`.

### Git Helper
The Git Helper provides a safe way to automate pull requests. It generates a script of commands for you to review and run in your own terminal.

### Scam Tracker
Enter a URL in the "Scam Tracker" input field. The agent will analyze it for common red flags and provide a report.

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

2. **Install Python dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

### Running the Application (Development)

1. **Start the backend server:**
   ```bash
   python backend/main.py
   ```

2. **Open your web browser:**
   Navigate to `http://127.0.0.1:5000` to access the application.

## Deployment (Production)

This application is ready to be deployed using Docker.

### Prerequisites
- Docker installed and running.

### Building the Docker Image
From the root of the project, run the following command to build the Docker image:
```bash
docker build -t ai-agent .
```

### Running the Docker Container
Once the image is built, you can run the application in a container with this command:
```bash
docker run -p 8000:8000 ai-agent
```

The application will be available at `http://localhost:8000`.

### Deploying to Heroku

This application is also ready to be deployed to Heroku.

#### Prerequisites
- A Heroku account.
- The Heroku CLI installed and logged in (`heroku login`).

#### Deployment Steps

1. **Create a Heroku app:**
   From the root of the project, run:
   ```bash
   heroku create your-app-name
   ```
   (Replace `your-app-name` with a unique name for your application).

2. **Push to Heroku:**
   Heroku uses Git for deployments. Push your code to the `heroku` remote:
   ```bash
   git push heroku main
   ```
   Heroku will automatically detect the Python application via the `requirements.txt` file and the `Procfile`, install dependencies, and start the Gunicorn server.

3. **Open the application:**
   Once the deployment is complete, you can open your live application in the browser:
   ```bash
   heroku open
   ```
