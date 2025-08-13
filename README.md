# AI Agent: Software Engineer, Debugger, Marketer, and System Analyzer

This project is a web-based AI agent that can perform several roles to assist with software development and business tasks.

## Features

- **Software Engineer:** Generates multi-section HTML and CSS for a static website based on a structured text prompt.
- **Debugger:** Lints HTML and CSS code to find basic errors.
- **Marketer:** Creates promotional social media posts from a business description.
- **System Analyzer:** Scans a website URL for broken links and suggests search queries to find solutions.

## How to Use the Software Engineer Agent

The Software Engineer agent uses a simple, indented syntax to define the components of a website. Provide a description in the "Software Engineer" text box, and the agent will return the HTML and CSS code in the response box below.

### Example Prompt Format

```
title: My Photography Portfolio
header: Jane Doe | Photographer
section: About Me
  text: I am a professional photographer specializing in landscapes.
section: Gallery
  images: 4
footer: Copyright © 2024 Jane Doe
```

This will generate a webpage with a title, a main header, two sections (one with text, one with 4 placeholder images), and a footer.

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
