# AI Agent: A Multi-Role Assistant

This project is a web-based AI agent that can perform several roles to assist with software development, business, and educational tasks.

## Features

- **Software Engineer:** Generates multi-section HTML and CSS for a static website based on a structured text prompt.
- **Debugger:** Lints HTML and CSS code to find basic errors. Can analyze pasted code or fetch a file directly from a GitHub URL.
- **Marketer:** Creates promotional social media posts from a business description.
- **System Analyzer:** Scans a website URL for broken links and suggests search queries to find solutions.
- **Designer:** Finds royalty-free images/videos and generates simple CSS animation scripts.
- **Educator:** Takes any question and provides a direct link to Google search results.
- **Cybersecurity Analyst:** Scans a website's HTTP headers and reports on key security headers.
- **Business Developer:** Generates a business plan outline and suggests SEO keyword research queries for a startup idea.

## How to Use

### Software Engineer
The Software Engineer agent uses a simple, indented syntax to define the components of a website. Provide a description in the "Software Engineer" text box, and the agent will return the HTML and CSS code in the response box below.

### Debugger
The Debugger agent can analyze code in two ways:
1.  **Paste Code:** Paste your HTML or CSS code directly into the large text area.
2.  **Use a GitHub URL:** Paste the URL of a public file on GitHub into the smaller URL input field.

### System Analyzer
Enter a full website URL (e.g., `https://example.com`) to scan the page for broken links.

### Designer
The Designer agent can help you with visual assets and animations.
- **To find images/videos:** Use prompts like `a photo of a sunset` or `a video of the ocean`.
- **To generate animations:** Use prompts like `a script for a fade in animation`.

### Educator
Ask any question in the "Educator" text box to get a link to the Google search results.

### Cybersecurity Analyst
Enter a full website URL (e.g., `https://example.com`) in the "Cybersecurity" input field to get a report on its security headers.

### Business Developer
The Business agent can help you with your startup idea.
- **To generate a business plan:** Enter your startup idea, e.g., `an app for dog walkers`.
- **To get keyword ideas:** Enter a prompt including the word "keywords", e.g., `keywords for a dog walking app`.

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
