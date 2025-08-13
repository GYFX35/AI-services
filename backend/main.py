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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
