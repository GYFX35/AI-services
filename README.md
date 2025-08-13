# AI Agent: Software Engineer, Debugger, Marketer, and System Analyzer

This project is a web-based AI agent that can perform several roles to assist with software development and business tasks.

## Features

- **Software Engineer:** Generates multi-section HTML and CSS for a static website based on a structured text prompt.
- **Debugger:** Lints HTML and CSS code to find basic errors. Can analyze pasted code or fetch a file directly from a GitHub URL.
- **Marketer:** Creates promotional social media posts from a business description.
- **System Analyzer:** Scans a website URL for broken links and suggests search queries to find solutions.

## How to Use

### Software Engineer
The Software Engineer agent uses a simple, indented syntax to define the components of a website. Provide a description in the "Software Engineer" text box, and the agent will return the HTML and CSS code in the response box below.

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

2. **Install Python dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   python backend/main.py
   ```

2. **Open your web browser:**
   Navigate to `http://127.0.0.1:5000` to access the application.
