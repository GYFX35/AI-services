import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, quote
from flask import Flask, jsonify, render_template, request

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/execute', methods=['POST'])
def execute():
    data = request.get_json()
    command = data.get('command')

    role = command.get('role')
    prompt = command.get('prompt')

    if role == 'develop':
        message = generate_website(prompt)
    elif role == 'debug':
        message = debug_code(prompt)
    elif role == 'market':
        message = generate_social_media_post(prompt)
    elif role == 'analyze':
        message = analyze_website(prompt)
    elif role == 'design':
        message = designer_agent(prompt)
    elif role == 'educate':
        message = educator_agent(prompt)
    elif role == 'cybersecurity':
        message = cybersecurity_agent(prompt)
    elif role == 'business':
        message = business_agent(prompt)
    else:
        message = "Unknown role."

    response = {
        "status": "success",
        "message": message
    }
    return jsonify(response)

def generate_website(prompt):
    import datetime

    # 1. Parse the structured prompt
    structure = {'sections': []}
    current_section = None
    for line in prompt.splitlines():
        if not line.strip():
            continue
        indentation = len(line) - len(line.lstrip(' '))
        try:
            key, value = line.strip().split(':', 1)
            key = key.strip().lower()
            value = value.strip()
        except ValueError:
            continue
        if indentation == 0:
            if key == 'section':
                current_section = {'title': value, 'content': {}}
                structure['sections'].append(current_section)
            else:
                structure[key] = value
                current_section = None
        elif indentation > 0 and current_section:
            current_section['content'][key] = value

    # 2. Generate HTML from the structure
    title = structure.get('title', 'My Website')
    header_content = structure.get('header', '')
    footer_content = structure.get('footer', '')

    main_content = ""
    for section in structure['sections']:
        main_content += f"    <section>\n"
        main_content += f"      <h2>{section.get('title', '')}</h2>\n"
        if 'text' in section['content']:
            main_content += f"      <p>{section['content']['text']}</p>\n"
        if 'images' in section['content']:
            try:
                num_images = int(section['content']['images'])
                for i in range(num_images):
                    main_content += f"      <img src='https://via.placeholder.com/150' alt='placeholder image {i+1}'>\n"
            except ValueError:
                pass # Ignore if 'images' is not a number
        main_content += f"    </section>\n"

    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>{header_content}</h1>
    </header>
    <main>
{main_content}
    </main>
    <footer>
        <p>{footer_content}</p>
    </footer>
</body>
</html>
    """

    # 3. Generate CSS from the structure
    css_content = """
body { font-family: sans-serif; line-height: 1.6; margin: 0; padding: 0; background: #f4f4f4; color: #333; }
.container { max-width: 960px; margin: auto; overflow: auto; padding: 0 2rem; }
header { background: #333; color: #fff; padding: 1rem 0; text-align: center; }
main { padding: 1rem; background: #fff; }
section { margin-bottom: 1.5rem; }
h2 { color: #333; }
img { max-width: 100%; height: auto; margin: 0.5rem; }
footer { text-align: center; padding: 1rem 0; background: #333; color: #fff; margin-top: 1rem; }
    """

    # 4. Return the generated code as a string
    response_message = f"""
Here is the generated code for your website.

**index.html:**
```html
{html_content.strip()}
```

**style.css:**
```css
{css_content.strip()}
```
"""
    return response_message.strip()

def debug_code(prompt):
    # Check if the prompt is a URL to a GitHub file
    if prompt.strip().startswith('http'):
        code = fetch_github_file(prompt)
        # Check if fetching the file returned an error message
        if code.startswith('Error:'):
            return code
    else:
        # If not a URL, the prompt is the code itself
        code = prompt

    # This is a very basic, custom linter.
    errors = []

    # More robust language detection
    if code.strip().startswith('<'):
        lang = 'HTML'
        # HTML checks
        if not code.lower().strip().startswith('<!doctype html>'):
            errors.append("Missing <!DOCTYPE html> declaration at the beginning.")

        if code.lower().count('<html') != code.lower().count('</html>'):
            errors.append("Mismatched <html> tags.")

        if code.lower().count('<head') != code.lower().count('</head>'):
            errors.append("Mismatched <head> tags.")

        if code.lower().count('<body') != code.lower().count('</body>'):
            errors.append("Mismatched <body> tags.")
    else:
        lang = 'CSS'
        # CSS checks
        if code.count('{') != code.count('}'):
            errors.append("Mismatched curly braces {}.")

        lines = code.split('\n')
        in_block = False
        for i, line in enumerate(lines):
            line = line.strip()
            if '{' in line:
                in_block = True
            if '}' in line:
                in_block = False

            if in_block and line and not line.endswith('{') and not line.endswith('}') and not line.endswith(';'):
                 errors.append(f"Line {i+1}: Missing semicolon ';'.")

    if not errors:
        return f"No obvious issues found in your {lang} code."
    else:
        return f"Found potential issues in your {lang} code:\n" + "\n".join(f"- {error}" for error in errors)

def generate_social_media_post(prompt):
    # Simple template for a social media post
    post = f"""
🚀 Big News! 🚀

We're excited to announce {prompt}!

Come and check us out! You won't be disappointed.

#NewBusiness #GrandOpening #{prompt.replace(" ", "").split(',')[0]} #SupportLocal
    """
    return post.strip()

def analyze_website(url):
    try:
        headers = {'User-Agent': 'AI-Agent-Checker/1.0'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status() # Raise an exception for bad status codes
    except requests.RequestException as e:
        return f"Error fetching URL: {e}"

    soup = BeautifulSoup(response.content, 'lxml')
    links = []
    for a_tag in soup.find_all('a', href=True):
        href = a_tag.get('href')
        # Join relative URLs with the base URL
        full_url = urljoin(url, href)
        # Only check http/https URLs
        if urlparse(full_url).scheme in ['http', 'https']:
            links.append(full_url)

    broken_links = []
    for link in links:
        try:
            # Use a HEAD request to be more efficient
            link_response = requests.head(link, headers=headers, timeout=5, allow_redirects=True)
            if link_response.status_code == 404:
                broken_links.append(link)
        except requests.RequestException:
            # Could be a timeout, DNS error, etc. Count these as "broken" for simplicity.
            broken_links.append(link)

    if not broken_links:
        return f"Scanned {len(links)} links on {url} and found no broken links (404s)."
    else:
        message = f"Found {len(broken_links)} broken links on {url}:\n\n"
        for link in broken_links:
            query = f"'{link}' on page '{url}' is a broken link"
            search_url = f"https://www.google.com/search?q={quote(query)}"
            message += f"- Broken Link: {link}\n"
            message += f"  Suggested Search: {search_url}\n\n"
        return message

def fetch_github_file(url):
    """
    Fetches the raw content of a file from a GitHub URL.
    """
    try:
        # Transform the URL
        parsed_url = urlparse(url)
        if parsed_url.hostname != 'github.com':
            return "Error: Not a valid GitHub URL."

        path_parts = parsed_url.path.strip('/').split('/')
        if len(path_parts) < 4 or path_parts[2] != 'blob':
            return "Error: URL does not appear to be a valid GitHub file URL (e.g., .../user/repo/blob/branch/file)."

        user, repo, _, branch = path_parts[:4]
        file_path = '/'.join(path_parts[4:])

        raw_url = f"https://raw.githubusercontent.com/{user}/{repo}/{branch}/{file_path}"

        # Fetch the content
        headers = {'User-Agent': 'AI-Agent-Checker/1.0'}
        response = requests.get(raw_url, headers=headers, timeout=10)
        response.raise_for_status()

        return response.text
    except requests.RequestException as e:
        return f"Error fetching file from GitHub: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def designer_agent(prompt):
    prompt = prompt.lower()

    # Intent: Find image or video
    if 'image' in prompt or 'photo' in prompt or 'picture' in prompt:
        search_term = prompt.replace('image of', '').replace('photo of', '').replace('picture of', '').strip()
        search_url = f"https://unsplash.com/s/photos/{quote(search_term)}"
        return f"Here are some photos of '{search_term}' on Unsplash:\n{search_url}"

    if 'video' in prompt:
        search_term = prompt.replace('video of', '').strip()
        search_url = f"https://www.pexels.com/search/videos/{quote(search_term)}/"
        return f"Here are some videos of '{search_term}' on Pexels:\n{search_url}"

    # Intent: Generate animation script
    if 'animation' in prompt or 'script' in prompt:
        if 'fade in' in prompt:
            css_snippet = """
/* CSS for a fade-in animation */
.fade-in {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
"""
            return f"Here is a CSS script for a fade-in animation:\n```css\n{css_snippet.strip()}\n```"

    return "Sorry, I can only find photos/videos or create a 'fade in' animation script for now."

def educator_agent(prompt):
    """
    Takes a user's question and returns a Google search URL for it.
    """
    search_url = f"https://www.google.com/search?q={quote(prompt)}"
    return f"Here is a Google search link for your question: '{prompt}'\n\n{search_url}"

def cybersecurity_agent(url):
    """
    Checks a URL for the presence of important security headers.
    """
    try:
        headers = {'User-Agent': 'AI-Agent-Checker/1.0'}
        response = requests.head(url, headers=headers, timeout=10, allow_redirects=True)
        response.raise_for_status()
    except requests.RequestException as e:
        return f"Error fetching URL: {e}"

    security_headers = {
        'Content-Security-Policy': 'Helps prevent XSS attacks.',
        'Strict-Transport-Security': 'Enforces secure (HTTPS) connections.',
        'X-Content-Type-Options': 'Prevents browsers from MIME-sniffing a response away from the declared content-type.',
        'X-Frame-Options': 'Protects against clickjacking attacks.',
        'Referrer-Policy': 'Controls how much referrer information is sent.',
        'Permissions-Policy': 'Controls which browser features can be used.'
    }

    present_headers = []
    missing_headers = []

    for header, description in security_headers.items():
        if header in response.headers:
            present_headers.append(f"- ✅ {header}: Present")
        else:
            missing_headers.append(f"- ❌ {header}: Missing. ({description})")

    report = f"Security Header Analysis for {url}:\n\n"
    if present_headers:
        report += "Found Headers:\n" + "\n".join(present_headers) + "\n\n"
    if missing_headers:
        report += "Missing Headers (Recommended):\n" + "\n".join(missing_headers)

    return report

def business_agent(prompt):
    """
    Generates a business plan outline or keyword suggestions for a startup idea.
    """
    l_prompt = prompt.lower()
    if 'keywords' in l_prompt or 'seo' in l_prompt:
        idea = l_prompt.replace('keywords for', '').replace('seo for', '').strip()
        suggestions = f"""
Here are some suggested Google searches to help you find keywords for '{idea}':

- `top keywords for {idea}`
- `long-tail keywords for {idea}`
- `"{idea}" competitor keywords`
- `"{idea}" target audience`
- `how to market {idea}`
- `content ideas for {idea}`
"""
        return suggestions.strip()

    business_plan = f"""
# Business Plan Outline for: {prompt}

## 1. Executive Summary
- **Mission Statement:** [A brief, memorable statement about your purpose]
- **Vision Statement:** [What is the long-term impact you want to have?]
- **Business Goals:** [e.g., Reach 10,000 users in the first year]
- **Target Market:** [Briefly describe your ideal customer]
- **Key Differentiators:** [What makes '{prompt}' unique?]

## 2. Company Description
- **Company Overview:** [Legal structure, history, and nature of the business]
- **Team:** [Brief bios of key team members and their roles]

## 3. Market Analysis
- **Industry Overview:** [Size, growth rate, and trends in your industry]
- **Target Audience:** [Detailed persona of your ideal customer: demographics, needs, pain points]
- **Competitor Analysis:** [List key competitors and their strengths/weaknesses]

## 4. Products & Services
- **Product/Service Description:** [Detailed description of what '{prompt}' offers]
- **Value Proposition:** [How do you solve your customers' problems or improve their situation?]
- **Future Products:** [Any plans for future products or services?]

## 5. Marketing & Sales Strategy
- **Marketing Plan:** [How will you reach your target audience? (e.g., social media, content marketing, SEO)]
- **Sales Strategy:** [How will you convert leads into customers?]
- **Pricing Strategy:** [How will you price your product/service?]

## 6. Financial Projections
- **Startup Costs:** [List of one-time expenses to get started]
- **Revenue Forecast:** [Projected revenue for the next 3-5 years]
- **Break-even Analysis:** [When do you expect to become profitable?]

---
*This is a generic outline. You should tailor it to the specific needs of '{prompt}'.*
"""
    return business_plan.strip()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
