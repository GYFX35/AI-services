import os
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, quote
from flask import Flask, jsonify, render_template, request
from backend.api_calls import call_openai_api

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
    elif role == 'develop_game':
        message = generate_game(prompt)
    elif role == 'develop_app':
        message = generate_app(prompt)
    elif role == 'debug':
        message = debug_code(prompt)
    elif role == 'market':
        message = generate_social_media_post(prompt)
    elif role == 'analyze':
        message = analyze_website(prompt)
    elif role == 'meteorology':
        message = get_weather(prompt)
    else:
        message = "Unknown role."

    response = {
        "status": "success",
        "message": message
    }
    return jsonify(response)

def get_weather(prompt):
    api_key = os.environ.get("WEATHER_API_KEY")
    if not api_key:
        return "Error: WEATHER_API_KEY environment variable not set."

    location = prompt.strip()

    if not location:
        return "Please provide a location."

    try:
        url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={location}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()

        if "error" in data:
            return f"Error: {data['error']['message']}"

        # Extract weather information
        location_data = data.get('location', {})
        current_data = data.get('current', {})

        city = location_data.get('name')
        region = location_data.get('region')
        country = location_data.get('country')
        temp_c = current_data.get('temp_c')
        temp_f = current_data.get('temp_f')
        condition = current_data.get('condition', {}).get('text')
        wind_mph = current_data.get('wind_mph')
        humidity = current_data.get('humidity')

        # Format the response
        message = (
            f"Weather in {city}, {region}, {country}:\\n"
            f"Temperature: {temp_c}°C / {temp_f}°F\\n"
            f"Condition: {condition}\\n"
            f"Wind: {wind_mph} mph\\n"
            f"Humidity: {humidity}%"
        )
        return message

    except requests.RequestException as e:
        return f"Error fetching weather data: {e}"
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def generate_game(prompt):
    api_prompt = f"""
Generate the HTML, CSS, and JavaScript for a web-based game based on the following prompt.
The response should be in the same format as the example below, with the HTML, CSS, and JavaScript in separate code blocks.

**index.html:**
```html
<!DOCTYPE html>
...
```

**style.css:**
```css
body {{
    ...
}}
```

**script.js:**
```javascript
document.addEventListener('DOMContentLoaded', () => {{
    ...
}});
```

Here is the prompt:
{prompt}
"""
    return call_openai_api(api_prompt, max_tokens=2048)

def generate_app(prompt):
    api_prompt = f"""
Generate the HTML, CSS, and JavaScript for a web-based application based on the following prompt.
The response should be in the same format as the example below, with the HTML, CSS, and JavaScript in separate code blocks.

**index.html:**
```html
<!DOCTYPE html>
...
```

**style.css:**
```css
body {{
    ...
}}
```

**script.js:**
```javascript
document.addEventListener('DOMContentLoaded', () => {{
    ...
}});
```

Here is the prompt:
{prompt}
"""
    return call_openai_api(api_prompt, max_tokens=2048)

def generate_website(prompt):
    api_prompt = f"""
Generate the HTML and CSS for a static website based on the following structured text prompt.
The response should be in the same format as the example below, with the HTML and CSS in separate code blocks.

**index.html:**
```html
<!DOCTYPE html>
...
```

**style.css:**
```css
body {{
    ...
}}
```

Here is the prompt:
{prompt}
"""
    return call_openai_api(api_prompt, max_tokens=2048)

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

    api_prompt = f"""
Please act as a code debugger. Analyze the following code for errors, and provide a summary of the issues found and suggestions for fixing them.

Here is the code:
```
{code}
```
"""
    return call_openai_api(api_prompt)

def generate_social_media_post(prompt):
    api_prompt = f"""
Generate a promotional social media post from the following business description.
The post should be engaging and include relevant hashtags.

Here is the business description:
{prompt}
"""
    return call_openai_api(api_prompt)

def analyze_website(url):
    try:
        headers = {'User-Agent': 'AI-Agent-Checker/1.0'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        return {'error': f"Error fetching URL: {e}"}

    soup = BeautifulSoup(response.content, 'lxml')
    links_to_check = []
    for a_tag in soup.find_all('a', href=True):
        href = a_tag.get('href')
        full_url = urljoin(url, href)
        if urlparse(full_url).scheme in ['http', 'https']:
            links_to_check.append({
                'url': full_url,
                'text': a_tag.get_text(strip=True)
            })

    results = {'ok': [], 'broken': [], 'slow': []}

    for link_data in links_to_check:
        full_url = link_data['url']
        anchor_text = link_data['text']

        try:
            start_time = time.time()
            link_response = requests.head(full_url, headers=headers, timeout=5, allow_redirects=True)
            end_time = time.time()

            response_time = round((end_time - start_time) * 1000)
            status_code = link_response.status_code

            link_result = {
                'url': full_url,
                'text': anchor_text,
                'status': status_code,
                'time_ms': response_time
            }

            if status_code >= 400:
                results['broken'].append(link_result)
            elif response_time > 1000:
                results['slow'].append(link_result)
            else:
                results['ok'].append(link_result)

        except requests.RequestException as e:
            results['broken'].append({
                'url': full_url,
                'text': anchor_text,
                'status': 'Error',
                'error': str(e)
            })

    return results

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
